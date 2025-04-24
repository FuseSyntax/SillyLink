export default function Analytics() {
  const analyticsData = {
    totalClicks: 150,
    clicksByDate: [
      { date: "2025-04-20", clicks: 50 },
      { date: "2025-04-21", clicks: 60 },
      { date: "2025-04-22", clicks: 40 },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-primary">
        <h2 className="text-3xl font-bold mb-8 text-primary">
          URL Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-6 bg-accent rounded-xl border-2 border-primary">
            <h3 className="text-xl font-semibold mb-4">Total Clicks</h3>
            <div className="text-4xl font-bold text-primary">
              {analyticsData.totalClicks}
            </div>
          </div>

          <div className="p-6 bg-accent rounded-xl border-2 border-primary">
            <h3 className="text-xl font-semibold mb-4">Clicks Timeline</h3>
            <div className="space-y-4">
              {analyticsData.clicksByDate.map((item) => (
                <div 
                  key={item.date}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border-2 border-primary"
                >
                  <span className="text-gray-700">{item.date}</span>
                  <span className="font-semibold text-primary">
                    {item.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}