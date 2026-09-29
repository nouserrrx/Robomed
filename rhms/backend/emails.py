import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_donation_receipt_email(don, recipient_email: str | None = None, recipient_name: str | None = None) -> bool:
    """
    Envoie un email de remerciement au donateur avec son Reçu Fiscal officiel en pièce jointe (PDF).
    """
    to_email = recipient_email
    name = recipient_name or "Généreux Donateur"

    if not to_email and don.donateur:
        to_email = don.donateur.email
        if hasattr(don.donateur, 'get_full_name') and don.donateur.get_full_name():
            name = don.donateur.get_full_name()
        elif hasattr(don.donateur, 'username'):
            name = don.donateur.username

    # Si l'email n'est toujours pas trouvé, chercher dans le message (ex: "Nom (email@domain.com)")
    if not to_email and don.message and '@' in don.message:
        import re
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', don.message)
        if match:
            to_email = match.group(0)

    if not to_email:
        logger.info("Aucune adresse email trouvée pour le don %s, envoi de reçu ignoré.", don.reference)
        return False

    montant_str = f"{don.montant:,.2f} €".replace(',', ' ')
    campagne_nom = don.campagne.titre if don.campagne else "Fonds d'Urgence et Actions Générales"

    subject = f"Merci pour votre don à RoBomed — Reçu Fiscal n° {don.reference}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #0B2447 0%, #19376D 100%); color: #ffffff; padding: 30px; text-align: center; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
        .header p {{ margin: 6px 0 0 0; color: #94a3b8; font-size: 14px; }}
        .content {{ padding: 30px; line-height: 1.6; font-size: 15px; }}
        .badge {{ display: inline-block; background-color: #dcfce7; color: #166534; font-weight: 600; padding: 4px 12px; border-radius: 9999px; font-size: 13px; }}
        .details-box {{ background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }}
        .details-row {{ display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }}
        .details-row:last-child {{ margin-bottom: 0; }}
        .label {{ color: #64748b; font-weight: 500; }}
        .value {{ color: #0f172a; font-weight: 600; }}
        .footer {{ background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>RoBomed — Reçu Fiscal Officiel</h1>
          <p>Association Humanitaire Internationale • Rép. du Tchad & International</p>
        </div>
        <div class="content">
          <p>Bonjour <strong>{name}</strong>,</p>
          <p>Au nom de toute l'équipe de <strong>RoBomed</strong> et des populations que nous accompagnons sur le terrain, nous vous remercions chaleureusement pour votre précieux soutien.</p>
          
          <div class="details-box">
            <div class="details-row"><span class="label">Référence du don :</span> <span class="value">{don.reference}</span></div>
            <div class="details-row"><span class="label">Montant du don :</span> <span class="value" style="color: #16a34a; font-size: 16px;">{montant_str}</span></div>
            <div class="details-row"><span class="label">Projet soutenu :</span> <span class="value">{campagne_nom}</span></div>
            <div class="details-row"><span class="label">Date de versement :</span> <span class="value">{don.date_don.strftime('%d/%m/%Y')}</span></div>
            <div class="details-row"><span class="label">Statut :</span> <span class="badge">Confirmé</span></div>
          </div>

          <p><strong>📎 Reçu Fiscal en pièce jointe :</strong><br>
          Votre reçu fiscal officiel au format PDF est joint à cet e-mail. Il atteste de votre don et vous permet de bénéficier d'une déduction fiscale légale de <strong>66 %</strong> du montant donné (dans la limite de 20 % de votre revenu imposable).</p>

          <p>Grâce à votre geste, nos forages solaires, nos kits scolaires et nos soins pédiatriques sauvent et transforment des vies chaque jour.</p>

          <p>Avec toute notre reconnaissance,<br>
          <strong>L'équipe RoBomed</strong></p>
        </div>
        <div class="footer">
          RoBomed — Association à but non lucratif • contact@robomed.org • www.robomed.org<br>
          Ce reçu a été édité automatiquement par la plateforme RoBomed RHMS.
        </div>
      </div>
    </body>
    </html>
    """
    
    text_content = strip_tags(html_content)
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'RoBomed <contact@robomed.org>')

    try:
        msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")

        # Génération du PDF du reçu fiscal officiel
        from reports.generators import build_tax_receipt_pdf
        pdf_buffer = build_tax_receipt_pdf(don)
        pdf_data = pdf_buffer.getvalue()
        msg.attach(f"Recu_Fiscal_{don.reference}.pdf", pdf_data, "application/pdf")

        msg.send(fail_silently=False)
        logger.info("Reçu fiscal pour le don %s envoyé avec succès à %s", don.reference, to_email)
        return True
    except Exception as e:
        logger.warning("Échec d'envoi du reçu fiscal par email pour le don %s à %s : %s", don.reference, to_email, e)
        return False


def send_volunteer_approval_email(benevole) -> bool:
    """
    Envoie une notification d'approbation et d'accueil officiel au bénévole.
    """
    user = benevole.utilisateur
    if not user or not user.email:
        return False

    name = f"{user.first_name} {user.last_name}".strip() or user.username
    subject = "Félicitations ! Votre candidature bénévole chez RoBomed est approuvée 🎉"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }}
        .header {{ background: #0B2447; color: #ffffff; padding: 25px; text-align: center; }}
        .content {{ padding: 30px; font-size: 15px; line-height: 1.6; }}
        .button {{ display: inline-block; background-color: #16A34A; color: #ffffff; text-decoration: none; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin: 15px 0; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin:0;">Bienvenue dans l'équipe RoBomed !</h2>
        </div>
        <div class="content">
          <p>Bonjour <strong>{name}</strong>,</p>
          <p>Nous avons le grand plaisir de vous informer que votre candidature au titre de <strong>Bénévole RoBomed</strong> a été officiellement <strong>validée et approuvée</strong> par notre équipe de coordination.</p>
          
          <p>Vos compétences ({benevole.competences or 'Solidarité / Terrain'}) sont un atout formidable pour nos missions humanitaires.</p>

          <p>Vous pouvez dès à présent accéder à votre espace bénévole pour consulter les missions disponibles et participer aux actions solidaires.</p>

          <p>Bienvenue parmi nous !<br>
          <strong>La Coordination des Bénévoles RoBomed</strong></p>
        </div>
      </div>
    </body>
    </html>
    """

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'RoBomed <contact@robomed.org>')
    try:
        msg = EmailMultiAlternatives(subject, strip_tags(html_content), from_email, [user.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        return True
    except Exception as e:
        logger.warning("Échec d'envoi d'email d'approbation bénévole à %s : %s", user.email, e)
        return False


def send_contact_acknowledgement_email(contact) -> bool:
    """
    Envoie un accusé de réception automatique au visiteur ayant envoyé un message de contact.
    """
    if not contact.email:
        return False

    name = f"{contact.prenom} {contact.nom}".strip() or "Visiteur"
    subject = f"Accusé de réception — Votre message à RoBomed : {contact.sujet}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }}
        .header {{ background: #0B2447; color: #ffffff; padding: 25px; text-align: center; }}
        .content {{ padding: 30px; font-size: 15px; line-height: 1.6; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2 style="margin:0;">RoBomed — Message bien reçu</h2>
        </div>
        <div class="content">
          <p>Bonjour <strong>{name}</strong>,</p>
          <p>Nous avons bien reçu votre message concernant : <em>"{contact.sujet}"</em>.</p>
          <p>Un membre de notre équipe de coordination prendra connaissance de votre demande et vous répondra dans les plus brefs délais.</p>
          <br>
          <p>Bien cordialement,<br><strong>L'équipe RoBomed</strong></p>
        </div>
      </div>
    </body>
    </html>
    """

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'RoBomed <contact@robomed.org>')
    try:
        msg = EmailMultiAlternatives(subject, strip_tags(html_content), from_email, [contact.email])
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        return True
    except Exception as e:
        logger.warning("Échec d'envoi d'accusé de réception à %s : %s", contact.email, e)
        return False
