import { Itinerary, SavedTrip } from '../types';
import { formatCurrency } from './budgetService';

// Simple PDF generation using browser APIs (no external dependencies)
export const exportToPDF = async (trip: Itinerary | SavedTrip): Promise<void> => {
  const itinerary = 'itinerary' in trip ? trip.itinerary : trip;
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export your trip to PDF');
    return;
  }
  
  // Generate HTML content
  const htmlContent = generateTripHTML(itinerary);
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};

// Generate HTML content for the trip
const generateTripHTML = (itinerary: Itinerary): string => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${itinerary.tripTitle}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .trip-title {
          font-size: 28px;
          color: #1e40af;
          margin: 0 0 10px 0;
        }
        .trip-subtitle {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
        }
        .trip-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .info-item {
          text-align: center;
        }
        .info-label {
          font-weight: bold;
          color: #374151;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 18px;
          color: #1f2937;
        }
        .day-plan {
          margin-bottom: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .day-header {
          background: #3b82f6;
          color: white;
          padding: 15px 20px;
          font-size: 20px;
          font-weight: bold;
        }
        .day-summary {
          padding: 15px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          font-style: italic;
          color: #6b7280;
        }
        .activities {
          padding: 20px;
        }
        .activity {
          margin-bottom: 20px;
          padding: 15px;
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
        }
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .activity-name {
          font-weight: bold;
          font-size: 16px;
          color: #1f2937;
        }
        .activity-type {
          background: #3b82f6;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .activity-description {
          color: #4b5563;
          line-height: 1.5;
        }
        .activity-cost {
          margin-top: 10px;
          font-weight: bold;
          color: #059669;
        }
        .budget-summary {
          margin-top: 30px;
          padding: 20px;
          background: #f0f9ff;
          border: 2px solid #0ea5e9;
          border-radius: 8px;
        }
        .budget-title {
          font-size: 20px;
          font-weight: bold;
          color: #0c4a6e;
          margin-bottom: 15px;
          text-align: center;
        }
        .budget-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        .budget-item {
          text-align: center;
          padding: 10px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e0f2fe;
        }
        .budget-label {
          font-size: 12px;
          color: #0c4a6e;
          margin-bottom: 5px;
        }
        .budget-amount {
          font-size: 16px;
          font-weight: bold;
          color: #0c4a6e;
        }
        .total-cost {
          text-align: center;
          margin-top: 20px;
          padding: 15px;
          background: #0ea5e9;
          color: white;
          border-radius: 6px;
          font-size: 18px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .day-plan { break-inside: avoid; }
          .activity { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="trip-title">${itinerary.tripTitle}</h1>
        <p class="trip-subtitle">Your personalized travel itinerary</p>
      </div>
      
      <div class="trip-info">
        <div class="info-item">
          <div class="info-label">Destination</div>
          <div class="info-value">${itinerary.destination}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Duration</div>
          <div class="info-value">${itinerary.duration} days</div>
        </div>
        <div class="info-item">
          <div class="info-label">Total Cost</div>
          <div class="info-value">${formatCurrency(itinerary.totalEstimatedCost)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Points Earned</div>
          <div class="info-value">${itinerary.pointsEarned}</div>
        </div>
      </div>
      
      ${itinerary.dailyPlans.map(dayPlan => `
        <div class="day-plan">
          <div class="day-header">Day ${dayPlan.day}: ${dayPlan.title}</div>
          <div class="day-summary">${dayPlan.summary}</div>
          <div class="activities">
            ${dayPlan.activities.map(activity => `
              <div class="activity">
                <div class="activity-header">
                  <span class="activity-name">${activity.name}</span>
                  <span class="activity-type">${activity.type}</span>
                </div>
                <div class="activity-description">${activity.description}</div>
                ${activity.estimatedCost ? `<div class="activity-cost">Estimated Cost: ${formatCurrency(activity.estimatedCost)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
      
      <div class="budget-summary">
        <div class="budget-title">Budget Breakdown</div>
        <div class="budget-breakdown">
          <div class="budget-item">
            <div class="budget-label">Daily Average</div>
            <div class="budget-amount">${formatCurrency(Math.round(itinerary.totalEstimatedCost / itinerary.duration))}</div>
          </div>
          <div class="budget-item">
            <div class="budget-label">Total Cost</div>
            <div class="budget-amount">${formatCurrency(itinerary.totalEstimatedCost)}</div>
          </div>
        </div>
        <div class="total-cost">
          Total Trip Cost: ${formatCurrency(itinerary.totalEstimatedCost)}
        </div>
      </div>
      
      <div class="footer">
        <p>Generated on ${currentDate} by AI Trip Planner</p>
        <p>Powered by AI. Travel responsibly.</p>
      </div>
    </body>
    </html>
  `;
};

// Alternative: Export as downloadable HTML file
export const exportAsHTML = (trip: Itinerary | SavedTrip): void => {
  const itinerary = 'itinerary' in trip ? trip.itinerary : trip;
  const htmlContent = generateTripHTML(itinerary);
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '_')}_itinerary.html`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
