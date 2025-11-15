import db from '../../lib/db';

async function getTickets() {
  try {
    const [tickets]: any = await db.query(
      'SELECT * FROM tickets WHERE closed = 0 ORDER BY created_at DESC LIMIT 50'
    );
    return tickets;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎫 Ticket Aperti</h1>
      
      {tickets.length === 0 ? (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400 text-xl">✅ Nessun ticket aperto</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket: any) => (
            <div key={ticket.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">
                    Ticket #{ticket.ticket_number}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p><strong>Utente ID:</strong> {ticket.user_id}</p>
                    <p><strong>Canale ID:</strong> {ticket.channel_id}</p>
                    <p><strong>Creato:</strong> {new Date(ticket.created_at).toLocaleString('it-IT')}</p>
                    {ticket.claimed && (
                      <p><strong>Gestito da:</strong> {ticket.claimed_by}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    ticket.claimed 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : 'bg-blue-600 text-blue-100'
                  }`}>
                    {ticket.claimed ? '👤 Assegnato' : '⏳ In Attesa'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}