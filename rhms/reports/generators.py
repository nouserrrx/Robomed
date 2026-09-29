import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

from beneficiaries.models import Beneficiaire
from donations.models import Don
from distributions.models import Distribution
from projects.models import Projet
from stocks.models import Stock
from volunteers.models import Benevole


def build_activity_pdf_report() -> io.BytesIO:
    """Génère un rapport d'activité humanitaire professionnel en PDF."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0B2447'),
        alignment=1, # Center
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#16A34A'),
        alignment=1,
    )
    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0B2447'),
        spaceBefore=14,
        spaceAfter=8,
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155'),
    )
    body_bold = ParagraphStyle(
        'BodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#0F172A'),
    )

    story = []

    # En-tête
    story.append(Paragraph("ORGANISATION HUMANITAIRE ROBOMED (RHMS)", subtitle_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("RAPPORT GLOBAL D'ACTIVITÉ & D'IMPACT", title_style))
    story.append(Spacer(1, 4))
    date_str = datetime.now().strftime("%d/%m/%Y à %H:%M")
    story.append(Paragraph(f"Généré le {date_str} • Bureaux : Canada & Tchad", subtitle_style))
    story.append(Spacer(1, 16))

    # Chiffres Clés
    story.append(Paragraph("1. SYNTHÈSE DES ACTIONS & INDICATEURS CLÉS", section_style))
    
    nb_beneficiaires = Beneficiaire.objects.count()
    nb_dons = Don.objects.filter(statut='confirme').count()
    total_dons = sum(d.montant for d in Don.objects.filter(statut='confirme'))
    nb_distributions = Distribution.objects.count()
    nb_projets = Projet.objects.count()
    nb_benevoles = Benevole.objects.count()

    kpi_data = [
        [
            Paragraph("<b>Bénéficiaires Aidés</b>", body_style),
            Paragraph(f"<b>{nb_beneficiaires}</b>", body_bold),
            Paragraph("<b>Fonds Collectés</b>", body_style),
            Paragraph(f"<b>{total_dons:,.2f} € / FCFA</b>", body_bold),
        ],
        [
            Paragraph("<b>Distributions Réalisées</b>", body_style),
            Paragraph(f"<b>{nb_distributions}</b>", body_bold),
            Paragraph("<b>Projets Actifs</b>", body_style),
            Paragraph(f"<b>{nb_projets}</b>", body_bold),
        ],
        [
            Paragraph("<b>Bénévoles Engagés</b>", body_style),
            Paragraph(f"<b>{nb_benevoles}</b>", body_bold),
            Paragraph("<b>Statut Plateforme</b>", body_style),
            Paragraph("<b>Opérationnelle</b>", body_bold),
        ]
    ]

    t_kpis = Table(kpi_data, colWidths=[130, 130, 130, 130])
    t_kpis.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_kpis)
    story.append(Spacer(1, 14))

    # Projets Récents
    story.append(Paragraph("2. PROJETS HUMANITAIRES", section_style))
    projets_qs = Projet.objects.all().order_by('-date_debut')[:6]
    proj_headers = [
        Paragraph("<b>Titre du Projet</b>", body_bold),
        Paragraph("<b>Budget</b>", body_bold),
        Paragraph("<b>Période</b>", body_bold),
        Paragraph("<b>Statut</b>", body_bold),
        Paragraph("<b>Progression</b>", body_bold),
    ]
    proj_rows = [proj_headers]
    for p in projets_qs:
        proj_rows.append([
            Paragraph(p.titre, body_style),
            Paragraph(f"{p.budget:,.0f}", body_style),
            Paragraph(f"{p.date_debut} au {p.date_fin}", body_style),
            Paragraph(p.get_statut_display(), body_style),
            Paragraph(f"{p.progression}%", body_style),
        ])

    t_projets = Table(proj_rows, colWidths=[170, 75, 125, 80, 70])
    t_projets.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B2447')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_projets)
    story.append(Spacer(1, 14))

    # Dernières Distributions
    story.append(Paragraph("3. DERNIÈRES DISTRIBUTIONS EFFECTUÉES", section_style))
    distrib_qs = Distribution.objects.select_related('produit', 'beneficiaire').order_by('-date_distribution')[:6]
    dist_headers = [
        Paragraph("<b>Date</b>", body_bold),
        Paragraph("<b>Produit</b>", body_bold),
        Paragraph("<b>Quantité</b>", body_bold),
        Paragraph("<b>Bénéficiaire</b>", body_bold),
        Paragraph("<b>Lieu</b>", body_bold),
    ]
    dist_rows = [dist_headers]
    for d in distrib_qs:
        dist_rows.append([
            Paragraph(d.date_distribution.strftime("%d/%m/%Y"), body_style),
            Paragraph(d.produit.nom if d.produit else '-', body_style),
            Paragraph(f"{d.quantite} {d.produit.unite_mesure if d.produit else ''}", body_style),
            Paragraph(f"{d.beneficiaire.prenom} {d.beneficiaire.nom}" if d.beneficiaire else '-', body_style),
            Paragraph(d.lieu or 'Tchad', body_style),
        ])

    t_dist = Table(dist_rows, colWidths=[70, 130, 80, 130, 110])
    t_dist.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#16A34A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_dist)
    story.append(Spacer(1, 14))

    # Pied de page
    story.append(Paragraph("Document confidentiel et officiel délivré par la direction de RoBomed Humanitaire.", subtitle_style))

    doc.build(story)
    buffer.seek(0)
    return buffer


def build_excel_report() -> io.BytesIO:
    """Génère un classeur Excel multi-feuilles avec les données consolidées."""
    wb = Workbook()
    
    header_fill = PatternFill(start_color="0B2447", end_color="0B2447", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    kpi_fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")

    # 1. Feuille Résumé
    ws_summary = wb.active
    ws_summary.title = "Synthèse & KPIs"
    ws_summary.append(["RAPPORT GLOBAL DE GESTION ROBOMED (RHMS)"])
    ws_summary.append([f"Date de génération : {datetime.now().strftime('%d/%m/%Y %H:%M')}"])
    ws_summary.append([])
    ws_summary.append(["Indicateur", "Valeur"])
    ws_summary.append(["Nombre total de bénéficiaires", Beneficiaire.objects.count()])
    ws_summary.append(["Nombre total de dons enregistrés", Don.objects.count()])
    ws_summary.append(["Dons confirmés", Don.objects.filter(statut='confirme').count()])
    ws_summary.append(["Montant total des dons confirmés", sum(d.montant for d in Don.objects.filter(statut='confirme'))])
    ws_summary.append(["Nombre de distributions réalisées", Distribution.objects.count()])
    ws_summary.append(["Nombre de projets humanitaires", Projet.objects.count()])
    ws_summary.append(["Nombre de bénévoles inscrits", Benevole.objects.count()])
    
    ws_summary.column_dimensions['A'].width = 38
    ws_summary.column_dimensions['B'].width = 25

    # 2. Feuille Dons
    ws_dons = wb.create_sheet(title="Dons & Collectes")
    headers_dons = ["Référence", "Montant", "Date", "Statut", "Donateur", "Campagne", "Message"]
    ws_dons.append(headers_dons)
    for col_idx in range(1, len(headers_dons) + 1):
        cell = ws_dons.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
    for d in Don.objects.all().order_by('-date_don'):
        donateur_nom = d.donateur.get_full_name() or d.donateur.username if d.donateur else "Anonyme"
        campagne_nom = d.campagne.titre if d.campagne else "Général"
        ws_dons.append([
            d.reference,
            float(d.montant),
            d.date_don.strftime("%Y-%m-%d %H:%M") if d.date_don else "",
            d.statut,
            donateur_nom,
            campagne_nom,
            d.message
        ])

    # 3. Feuille Distributions
    ws_dist = wb.create_sheet(title="Distributions")
    headers_dist = ["ID", "Produit", "Quantité", "Unité", "Bénéficiaire", "Lieu", "Date"]
    ws_dist.append(headers_dist)
    for col_idx in range(1, len(headers_dist) + 1):
        cell = ws_dist.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
    for dist in Distribution.objects.select_related('produit', 'beneficiaire').order_by('-date_distribution'):
        ws_dist.append([
            dist.id,
            dist.produit.nom if dist.produit else "",
            float(dist.quantite),
            dist.produit.unite_mesure if dist.produit else "",
            f"{dist.beneficiaire.prenom} {dist.beneficiaire.nom}" if dist.beneficiaire else "",
            dist.lieu,
            dist.date_distribution.strftime("%Y-%m-%d %H:%M") if dist.date_distribution else ""
        ])

    # 4. Feuille Stocks
    ws_stock = wb.create_sheet(title="Stocks & Inventaires")
    headers_stock = ["ID", "Produit", "Catégorie", "Quantité Disponible", "Unité", "Seuil Alerte", "Emplacement"]
    ws_stock.append(headers_stock)
    for col_idx in range(1, len(headers_stock) + 1):
        cell = ws_stock.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
    for s in Stock.objects.select_related('produit').all():
        ws_stock.append([
            s.id,
            s.produit.nom if s.produit else "",
            s.produit.categorie if s.produit else "",
            float(s.quantite),
            s.produit.unite_mesure if s.produit else "",
            float(s.seuil_alerte),
            s.location
        ])

    # 5. Feuille Bénéficiaires
    ws_ben = wb.create_sheet(title="Bénéficiaires")
    headers_ben = ["ID", "Nom", "Prénom", "Téléphone", "Email", "Type d'Aide", "Adresse", "Date Enregistrement"]
    ws_ben.append(headers_ben)
    for col_idx in range(1, len(headers_ben) + 1):
        cell = ws_ben.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
    for b in Beneficiaire.objects.all().order_by('-date_enregistrement'):
        ws_ben.append([
            b.id,
            b.nom,
            b.prenom,
            b.telephone,
            b.email,
            b.type_aide,
            b.adresse,
            b.date_enregistrement.strftime("%Y-%m-%d %H:%M") if b.date_enregistrement else ""
        ])

    buffer = io.BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer


def build_tax_receipt_pdf(don: Don) -> io.BytesIO:
    """Génère le reçu fiscal officiel d'un don au format PDF."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'ReceiptTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0B2447'),
        alignment=1,
    )
    ref_style = ParagraphStyle(
        'ReceiptRef',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#16A34A'),
        alignment=1,
    )
    body_style = ParagraphStyle(
        'RBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#1E293B'),
    )
    body_bold = ParagraphStyle(
        'RBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0B2447'),
    )

    story = []

    # En-tête
    story.append(Paragraph("<b>ROBOMED HUMANITAIRE</b>", ParagraphStyle('H', parent=title_style, fontSize=16, textColor=colors.HexColor('#16A34A'))))
    story.append(Paragraph("Organisation Étudiante Humanitaire (Canada & Tchad)<br/>Contact : contact@robomed.org", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("REÇU FISCAL OFFICIEL DE DON", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"RÉFÉRENCE : {don.reference}", ref_style))
    story.append(Spacer(1, 20))

    donor_name = don.donateur.get_full_name() or don.donateur.username if don.donateur else "Donateur Bienfaiteur"
    donor_email = don.donateur.email if don.donateur else "-"
    date_str = don.date_don.strftime("%d/%m/%Y") if don.date_don else datetime.now().strftime("%d/%m/%Y")
    campagne_name = don.campagne.titre if don.campagne else "Fonds Général de Solidarité"

    table_data = [
        [Paragraph("<b>Date du don :</b>", body_bold), Paragraph(date_str, body_style)],
        [Paragraph("<b>Donateur :</b>", body_bold), Paragraph(donor_name, body_style)],
        [Paragraph("<b>Courriel :</b>", body_bold), Paragraph(donor_email, body_style)],
        [Paragraph("<b>Affectation :</b>", body_bold), Paragraph(campagne_name, body_style)],
        [Paragraph("<b>Montant versé :</b>", body_bold), Paragraph(f"<b>{don.montant:,.2f}</b>", ParagraphStyle('M', parent=body_bold, fontSize=14, textColor=colors.HexColor('#16A34A')))],
        [Paragraph("<b>Statut du règlement :</b>", body_bold), Paragraph(f"Confirmé ({don.get_statut_display()})", body_style)],
    ]

    t = Table(table_data, colWidths=[150, 350])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 25))

    story.append(Paragraph(
        "<i>L'organisme certifie que le présent reçu correspond à un don bénévole, sans contrepartie directe ou indirecte au profit de l'auteur du versement. Ce reçu donne droit aux déductions fiscales en vigueur au Canada et conformément aux lois locales applicables.</i>",
        ParagraphStyle('Legal', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor('#64748B'))
    ))
    story.append(Spacer(1, 35))

    # Signature
    sig_data = [
        [Paragraph("<b>Pour le Donateur</b>", body_style), Paragraph("<b>Pour l'Organisation RoBomed</b>", body_style)],
        [Spacer(1, 30), Spacer(1, 30)],
        [Paragraph("Mention lu et approuvé", body_style), Paragraph("La Présidence & Trésorerie Générale", body_bold)],
    ]
    t_sig = Table(sig_data, colWidths=[250, 250])
    t_sig.setStyle(TableStyle([
        ('LINEBELOW', (0, 1), (0, 1), 1, colors.HexColor('#CBD5E1')),
        ('LINEBELOW', (1, 1), (1, 1), 1, colors.HexColor('#CBD5E1')),
    ]))
    story.append(t_sig)

    doc.build(story)
    buffer.seek(0)
    return buffer
