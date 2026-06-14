// Resend Email Service
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || '';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '';
const SUPPORT_PHONE = process.env.SUPPORT_PHONE || '';

function formatSupportLine() {
  return [SUPPORT_PHONE, CONTACT_EMAIL].filter(Boolean).join(' | ');
}

export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return { success: false, error: 'Email not configured' };
  }
  if (!EMAIL_FROM || !to) {
    console.error('Email sender or recipient not configured');
    return { success: false, error: 'Email sender or recipient not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      console.error('Resend error:', data);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

// Email Templates
export function getLeadNotificationEmail(lead) {
  return {
    subject: `Nouvelle demande ${lead.type.toUpperCase()} - ${lead.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">NEXORA NTN</h1>
          <p style="color: #93c5fd; margin: 10px 0 0;">Nouvelle demande reçue</p>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a5f;">Détails de la demande</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Type</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.type}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Nom</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.name}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Téléphone</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.phone}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.email || 'Non fourni'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Entreprise</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.company || 'Non fourni'}</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pays / Ville</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.country} ${lead.city ? '/ ' + lead.city : ''}</td></tr>
            ${lead.pack ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pack</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.pack}</td></tr>` : ''}
            ${lead.message ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Message</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${lead.message}</td></tr>` : ''}
          </table>
        </div>
        <div style="padding: 20px; background: #1e3a5f; text-align: center;">
          <p style="color: #93c5fd; margin: 0;">© ${new Date().getFullYear()} NEXORA Technologies & Networks</p>
        </div>
      </div>
    `,
    text: `Nouvelle demande ${lead.type}: ${lead.name} - ${lead.phone} - ${lead.email || 'N/A'}`
  };
}

export function getOrderConfirmationEmail(order, items) {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.quantity * item.price}</td>
    </tr>
  `).join('');

  return {
    subject: `Commande #${order.orderNumber} - NEXORA NTN`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">NEXORA NTN</h1>
          <p style="color: #93c5fd; margin: 10px 0 0;">Confirmation de commande</p>
        </div>
        <div style="padding: 30px; background: #f8fafc;">
          <h2 style="color: #1e3a5f;">Commande #${order.orderNumber}</h2>
          <p>Merci pour votre commande !</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #e2e8f0;">
                <th style="padding: 10px; text-align: left;">Produit</th>
                <th style="padding: 10px; text-align: center;">Qté</th>
                <th style="padding: 10px; text-align: right;">Prix</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold; background: #1e3a5f; color: white;">
                <td colspan="3" style="padding: 15px;">TOTAL</td>
                <td style="padding: 15px; text-align: right;">$${order.total}</td>
              </tr>
            </tfoot>
          </table>
          <p><strong>Statut:</strong> ${order.status}</p>
          <p><strong>Mode de paiement:</strong> ${order.paymentMethod}</p>
        </div>
        <div style="padding: 20px; background: #1e3a5f; text-align: center;">
          <p style="color: white; margin: 0 0 10px;">Des questions ? Contactez-nous</p>
          <p style="color: #93c5fd; margin: 0;">${formatSupportLine()}</p>
        </div>
      </div>
    `,
    text: `Commande #${order.orderNumber} confirmée. Total: $${order.total}`
  };
}

export { CONTACT_EMAIL };
