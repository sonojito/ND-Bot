import db from '../lib/db';

async function getStats() {
  try {
    const [ticketsResult]: any = await db.query(
      'SELECT COUNT(*) as total, SUM(closed = 0) as open, SUM(closed = 1) as closed FROM tickets'
    );
    const [warningsResult]: any = await db.query('SELECT COUNT(*) as count FROM warnings');
    const [feedbackResult]: any = await db.query('SELECT COUNT(*) as count FROM feedback');

    return {
      tickets: ticketsResult[0],
      warnings: warningsResult[0].count,
      feedback: feedbackResult[0].count
    };
  } catch (error) {
    console.error('Database error:', error);
    return { tickets: { total: 0, open: 0, closed: 0 }, warnings: 0, feedback: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard ND-Bot</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-500">
          <div className="text-blue-400 text-3xl mb-2">🎫</div>
          <h3 className="text-gray-400 text-sm uppercase">Ticket Totali</h3>
          <p className="text-3xl font-bold">{stats.tickets.total}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-green-500">
          <div className="text-green-400 text-3xl mb-2">🟢</div>
          <h3 className="text-gray-400 text-sm uppercase">Ticket Aperti</h3>
          <p className="text-3xl font-bold">{stats.tickets.open}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-yellow-500">
          <div className="text-yellow-400 text-3xl mb-2">⚠️</div>
          <h3 className="text-gray-400 text-sm uppercase">Avvisi</h3>
          <p className="text-3xl font-bold">{stats.warnings}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-purple-500">
          <div className="text-purple-400 text-3xl mb-2">💬</div>
          <h3 className="text-gray-400 text-sm uppercase">Feedback</h3>
          <p className="text-3xl font-bold">{stats.feedback}</p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">🚀 Benvenuto</h2>
        <p className="text-gray-300 mb-4">
          Benvenuto nella dashboard di ND-Bot! Da qui puoi gestire tutti gli aspetti del bot.
        </p>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• Visualizza e gestisci i ticket aperti</p>
          <p>• Controlla i log del sistema</p>
          <p>• Monitora gli avvisi degli utenti</p>
          <p>• Leggi i feedback ricevuti</p>
        </div>
      </div>
    </div>
  );
}