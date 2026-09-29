export interface TaxReceiptData {
  reference: string
  donorName: string
  donorEmail: string
  amount: number
  currency: string
  project: string
  date: string
}

export function generateTaxReceiptPDF(data: TaxReceiptData) {
  const windowRef = window.open('', '_blank')
  if (!windowRef) return

  const receiptDate = data.date ? new Date(data.date).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
  const taxDeduction = data.currency === '€' ? `${(data.amount * 0.66).toFixed(2)} €` : data.currency === 'CAD' ? `${(data.amount * 0.50).toFixed(2)} CAD` : 'Déductible'

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Reçu Fiscal de Don - RoBomed (${data.reference})</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: center; border-b: 3px solid #059669; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: 800; color: #0b2447; }
        .logo span { color: #059669; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
        .receipt-title { font-size: 20px; font-weight: 700; text-align: center; margin: 30px 0 10px 0; color: #0b2447; text-transform: uppercase; letter-spacing: 1px; }
        .ref-number { text-align: center; font-family: monospace; color: #059669; font-weight: bold; margin-bottom: 30px; }
        .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; background: #f8fafc; margin-bottom: 25px; }
        .box-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px; }
        .grid-item label { display: block; font-size: 11px; color: #94a3b8; font-weight: 600; }
        .grid-item span { font-weight: 700; color: #0f172a; }
        .amount-card { background: linear-gradient(135deg, #0b2447, #059669); color: white; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; }
        .amount-val { font-size: 32px; font-weight: 800; margin: 5px 0; }
        .tax-info { font-size: 13px; color: #334155; line-height: 1.6; border-left: 4px solid #059669; padding-left: 15px; margin-bottom: 30px; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
        .sig-box { text-align: center; width: 45%; }
        .sig-line { border-top: 1px border #cbd5e1; margin-top: 40px; padding-top: 8px; font-weight: 600; color: #475569; }
        .footer { font-size: 10px; text-align: center; color: #94a3b8; margin-top: 60px; border-t: 1px solid #f1f5f9; padding-top: 15px; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer;">🖨️ Imprimer / Sauvegarder en PDF</button>
      </div>

      <div class="header">
        <div>
          <div class="logo">RoBomed <span>Humanitaire</span></div>
          <div class="subtitle">Organisation Étudiante Humanitaire Binational (🇨🇦 Canada & 🇹🇩 Tchad)</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #64748b;">
          <strong>Date du reçu :</strong> ${receiptDate}
        </div>
      </div>

      <div class="receipt-title">Reçu Fiscal Officiel de Don</div>
      <div class="ref-number">RÉFÉRENCE : ${data.reference}</div>

      <div class="box">
        <div class="box-title">Informations du Donateur</div>
        <div class="grid">
          <div class="grid-item"><label>Nom & Prénom</label><span>${data.donorName}</span></div>
          <div class="grid-item"><label>Adresse Email</label><span>${data.donorEmail}</span></div>
        </div>
      </div>

      <div class="amount-card">
        <div style="font-size: 12px; opacity: 0.9;">Montant du Don Reçu</div>
        <div class="amount-val">${data.amount.toLocaleString('fr-FR')} ${data.currency}</div>
        <div style="font-size: 12px; opacity: 0.9;">Affectation : ${data.project}</div>
      </div>

      <div class="tax-info">
        <strong>Déduction Fiscale :</strong> Ce reçu atteste du versement d'un don à l'organisation RoBomed. 
        Pour ce montant, la réduction d'impôt applicable s'élève estimativement à <strong>${taxDeduction}</strong> 
        selon la législation fiscale en vigueur.
      </div>

      <div class="signatures">
        <div class="sig-box">
          <div style="font-weight: bold;">Équipe Fondatrice</div>
          <div style="font-size: 11px; color: #64748b;">Aïcha Baradine & Direction RoBomed</div>
          <div class="sig-line">Signature autorisée</div>
        </div>
        <div class="sig-box">
          <div style="font-weight: bold;">Sceau de l'Organisation</div>
          <div style="font-size: 11px; color: #64748b;">Certification & Conformité</div>
          <div class="sig-line">RoBomed Canada / Tchad</div>
        </div>
      </div>

      <div class="footer">
        RoBomed — Organisation d'engagement étudiant binational créée le 22 Avril 2025. Contact : contact@robomed.org
      </div>
    </body>
    </html>
  `

  windowRef.document.write(htmlContent)
  windowRef.document.close()
}
