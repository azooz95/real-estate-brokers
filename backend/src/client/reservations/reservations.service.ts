import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';

// puppeteer-core and @sparticuz/chromium are ESM-only — dynamic import()
// keeps them out of this file's module graph, since a static import would
// crash the whole (CommonJS) Nest app at load time, not just this route.
//
// On Vercel there's no system Chrome install — @sparticuz/chromium ships a
// binary built for the serverless runtime instead. Locally/Docker keep using
// a real installed browser via CHROME_PATH.
async function launchBrowser() {
  const { default: puppeteer } = await import('puppeteer-core');
  if (process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium');
    return puppeteer.launch({
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: true,
    });
  }
  return puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId },
    });
    if (!unit) throw new NotFoundException('Unit not found');
    if (unit.status === 'reserved')
      throw new ConflictException('Unit is already reserved');

    // A suspended broker's tracking link no longer attributes — same as no ref.
    const broker = dto.brokerRef
      ? await this.prisma.broker.findFirst({
          where: { id: dto.brokerRef, status: 'active' },
        })
      : null;

    const settings = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });
    const deposit = unit.deposit ?? settings?.reservationDeposit ?? 5000;
    const id = await this.generateId();

    const reservation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.reservation.create({
        data: {
          id,
          unitId: unit.id,
          brokerId: broker?.id,
          clientName: dto.client.name,
          clientPhone: dto.client.phone,
          deposit,
          paymentMethod: dto.paymentMethod,
          status: 'confirmed',
        },
      });
      await tx.unit.update({
        where: { id: unit.id },
        data: { status: 'reserved' },
      });
      return created;
    });

    return this.toResult(reservation.id);
  }

  async getResult(id: string) {
    return this.toResult(id);
  }

  private async generateId(): Promise<string> {
    let id: string;
    do {
      id = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (await this.prisma.reservation.findUnique({ where: { id } }));
    return id;
  }

  private async toResult(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { unit: true, broker: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');

    return {
      id: reservation.id,
      status: reservation.status,
      unitCode: reservation.unit.code,
      deposit: reservation.deposit,
      broker: reservation.broker?.name ?? null,
      receiptUrl: `/api/reservations/${reservation.id}/receipt/pdf`,
    };
  }

  async getReceiptHtml(id: string) {
    return this.buildReceiptHtml(await this.loadReceiptData(id));
  }

  // Renders the same template used for the HTML view through a real browser
  // so the download is an actual PDF, not a plain page — matches the visual
  // shape of the on-screen receipt (ReceiptPanel.jsx / Success.jsx).
  async getReceiptPdf(id: string): Promise<Buffer> {
    const html = await this.getReceiptHtml(id);
    const browser = await launchBrowser();
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const pdf = await page.pdf({
        format: 'a4',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private async loadReceiptData(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { unit: { include: { project: true } }, broker: true },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  private buildReceiptHtml(
    reservation: Awaited<ReturnType<ReservationsService['loadReceiptData']>>,
  ) {
    const sar = (n: number) =>
      new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);
    const initials = reservation.broker
      ? reservation.broker.name
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
      : '—';
    const date = reservation.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    return `<!doctype html>
<html><head><meta charset="utf-8"><title>Receipt ${reservation.id}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1B1B1D; background: #fff; }
  .bar { height: 4px; background: #4A0810; }
  .header { padding: 32px; background: linear-gradient(180deg, #faf3f4, #fff); }
  .brand { font-size: 13px; font-weight: 700; letter-spacing: .08em; color: #4A0810; }
  .row { display: flex; justify-content: space-between; gap: 16px; margin-top: 28px; }
  .verified { display: flex; align-items: center; gap: 8px; color: #004036; font-size: 12px; font-weight: 700; letter-spacing: .04em; }
  .title { font-size: 32px; font-weight: 700; color: #1B1B1D; margin-top: 10px; line-height: 1.1; }
  .ref { font-size: 13px; color: #544242; margin-top: 8px; }
  .ref b { color: #1B1B1D; }
  .right { text-align: right; font-size: 13px; color: #544242; line-height: 1.7; }
  .right .org { font-weight: 700; color: #4A0810; letter-spacing: .05em; font-size: 12px; }
  .hr { height: 1px; background: #efdfe1; margin-top: 24px; }
  .body { padding: 0 32px 32px; }
  .cols { display: flex; gap: 28px; margin-top: 28px; }
  .col { flex: 1; }
  .label { font-size: 11px; font-weight: 700; color: #877271; letter-spacing: .06em; padding-bottom: 10px; border-bottom: 1px solid #f1edf0; }
  .name { font-size: 20px; font-weight: 700; color: #1B1B1D; margin-top: 16px; }
  .meta { font-size: 13px; color: #544242; margin-top: 8px; }
  .fin-row { display: flex; justify-content: space-between; margin-top: 16px; font-size: 15px; color: #1B1B1D; }
  .fin-row.first { margin-top: 24px; }
  .included { color: #004036; font-weight: 600; }
  .total { display: flex; justify-content: space-between; align-items: center; gap: 16px; background: #f6ecee; border-radius: 10px; padding: 24px; margin-top: 24px; }
  .total .badge { display: flex; align-items: center; gap: 8px; margin-top: 8px; font-size: 12px; font-weight: 700; color: #4A0810; letter-spacing: .04em; }
  .total .dot { width: 7px; height: 7px; border-radius: 50%; background: #4A0810; display: inline-block; }
  .total .amount { font-size: 30px; font-weight: 700; color: #4A0810; line-height: 1; text-align: right; }
  .total .amount span { font-size: 16px; }
  .total .words { font-size: 12px; color: #9a7a7e; margin-top: 6px; text-align: right; }
  .footer { display: grid; grid-template-columns: 1fr 1.3fr; gap: 20px; align-items: start; margin-top: 28px; padding-top: 28px; border-top: 1px solid #f1edf0; }
  .agent-label { font-size: 11px; font-weight: 700; color: #877271; letter-spacing: .06em; }
  .agent { display: flex; align-items: center; gap: 12px; margin-top: 14px; }
  .avatar { width: 38px; height: 38px; border-radius: 50%; background: #f6d9d9; color: #4A0810; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .agent-name { font-size: 15px; color: #1B1B1D; }
  .legal { font-size: 11px; color: #999; line-height: 1.6; text-align: right; }
</style>
</head><body>
<div class="bar"></div>
<div class="header">
  <div class="brand">JIWAR ALOULA</div>
  <div class="row">
    <div>
      <div class="verified">✓ VERIFIED RECEIPT</div>
      <div class="title">Reservation Receipt</div>
      <div class="ref">Reference <b>#${reservation.id}</b> • ${date}</div>
    </div>
    <div class="right">
      <div class="org">HERITAGE EXCELLENCE</div>
      <div>Jiwar Aloula Real Estate Investment</div>
      <div>Riyadh, Kingdom of Saudi Arabia</div>
    </div>
  </div>
  <div class="hr"></div>
</div>
<div class="body">
  <div class="cols">
    <div class="col">
      <div class="label">CLIENT DETAILS</div>
      <div class="name">${reservation.clientName}</div>
      <div class="meta">📞 ${reservation.clientPhone}</div>
    </div>
    <div class="col">
      <div class="label">PROPERTY INFORMATION</div>
      <div class="name">${reservation.unit.title}</div>
      <div class="meta">${reservation.unit.project.name} — Unit ${reservation.unit.code}</div>
    </div>
  </div>

  <div class="label" style="margin-top:28px">FINANCIAL BREAKDOWN</div>
  <div class="fin-row first"><span>Initial Deposit</span><span>${sar(reservation.deposit)} SAR</span></div>
  <div class="fin-row"><span>Admin Fees</span><span class="included">Included</span></div>
  <div class="fin-row"><span>Payment Method</span><span>${reservation.paymentMethod.toUpperCase()}</span></div>

  <div class="total">
    <div>
      <div class="label" style="border-bottom:none;padding-bottom:0">TOTAL PAID</div>
      <div class="badge"><span class="dot"></span>${reservation.status.toUpperCase()}</div>
    </div>
    <div>
      <div class="amount">${sar(reservation.deposit)} <span>SAR</span></div>
    </div>
  </div>

  <div class="footer">
    <div>
      <div class="agent-label">ASSIGNED AGENT</div>
      <div class="agent">
        <div class="avatar">${initials}</div>
        <div class="agent-name">${reservation.broker?.name ?? 'Direct — no marketer attributed'}</div>
      </div>
    </div>
    <div class="legal">This receipt confirms a reservation deposit, not a final sale contract.<br>Contact our sales office for the full purchase agreement.</div>
  </div>
</div>
</body></html>`;
  }
}
