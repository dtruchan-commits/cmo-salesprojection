import React, { useState, useMemo } from 'react';
import './DataVisualization.css';

interface SalesData {
  kunde: string;
  produkt: string;
  supplyCenter: string;
  data: {
    [year: string]: number;
  };
}

const DataVisualization: React.FC = () => {
  // Sample data based on your provided information
  const rawData: SalesData[] = [
    {
      kunde: 'ABC Pharma',
      produkt: 'Testprodukt A',
      supplyCenter: 'Berlin',
      data: { '2025': 1.2, '2026': 1.4, '2027': 1.6, '2028': 1.8, '2029': 1.6, '2030': 1.4 }
    },
    {
      kunde: 'ABC Pharma',
      produkt: 'Testprodukt B',
      supplyCenter: 'Berlin',
      data: { '2025': 2, '2026': 3, '2027': 2, '2028': 2, '2029': 1, '2030': 2 }
    },
    {
      kunde: 'ABC Pharma',
      produkt: 'Testprodukt C',
      supplyCenter: 'Leverkusen',
      data: { '2025': 3, '2026': 4, '2027': 3, '2028': 3, '2029': 3, '2030': 3 }
    },
    {
      kunde: 'ABC Pharma',
      produkt: 'Testprodukt C',
      supplyCenter: 'Garbagnate',
      data: { '2025': 1, '2026': 2, '2027': 3, '2028': 4, '2029': 5, '2030': 6 }
    },
    {
      kunde: 'XYZ Pharma',
      produkt: 'Fakeprodukt A',
      supplyCenter: 'Garbagnate',
      data: { '2025': 1, '2026': 1, '2027': 1, '2028': 0.5, '2029': 0.6, '2030': 0.3 }
    },
    {
      kunde: 'XYZ Pharma',
      produkt: 'Fakeprodukt B',
      supplyCenter: 'Orizaba',
      data: { '2025': 2, '2026': 2, '2027': 2.3, '2028': 2.4, '2029': 2.5, '2030': 2.8 }
    },
    {
      kunde: 'XYZ Pharma',
      produkt: 'Fakeprodukt C',
      supplyCenter: 'Shiga',
      data: { '2025': 1, '2026': 2, '2027': 1, '2028': 2, '2029': 1, '2030': 2 }
    }
  ];

  const [selectedKunde, setSelectedKunde] = useState<string>('All');
  const [selectedProdukt, setSelectedProdukt] = useState<string>('All');
  const [selectedSupplyCenter, setSelectedSupplyCenter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // Extract unique values for filters
  const uniqueKunden = useMemo(() => 
    Array.from(new Set(rawData.map(item => item.kunde))).sort(),
    [rawData]
  );

  const uniqueProdukte = useMemo(() => 
    Array.from(new Set(rawData.map(item => item.produkt))).sort(),
    [rawData]
  );

  const uniqueSupplyCenters = useMemo(() => 
    Array.from(new Set(rawData.map(item => item.supplyCenter))).sort(),
    [rawData]
  );

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      const kundeMatch = selectedKunde === 'All' || item.kunde === selectedKunde;
      const produktMatch = selectedProdukt === 'All' || item.produkt === selectedProdukt;
      const supplyCenterMatch = selectedSupplyCenter === 'All' || item.supplyCenter === selectedSupplyCenter;
      
      return kundeMatch && produktMatch && supplyCenterMatch;
    });
  }, [selectedKunde, selectedProdukt, selectedSupplyCenter]);

  const years = ['2025', '2026', '2027', '2028', '2029', '2030'];

  // Calculate totals for each year
  const yearlyTotals = useMemo(() => {
    const totals: { [year: string]: number } = {};
    years.forEach(year => {
      totals[year] = filteredData.reduce((sum, item) => sum + (item.data[year] || 0), 0);
    });
    return totals;
  }, [filteredData]);

  const clearFilters = () => {
    setSelectedKunde('All');
    setSelectedProdukt('All');
    setSelectedSupplyCenter('All');
  };

  const getMaxValue = () => {
    return Math.max(...filteredData.flatMap(item => Object.values(item.data)));
  };

  const renderBarChart = () => {
    const maxValue = getMaxValue();
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>Sales Projection Chart</h3>
        </div>
        <div className="bar-chart">
          {years.map(year => (
            <div key={year} className="year-column">
              <div className="year-label">{year}</div>
              <div className="bar-container">
                {filteredData.map((item, index) => {
                  const value = item.data[year];
                  const height = (value / maxValue) * 200; // Max height 200px
                  return (
                    <div
                      key={`${item.kunde}-${item.produkt}-${item.supplyCenter}-${year}`}
                      className="bar"
                      style={{ 
                        height: `${height}px`,
                        backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`
                      }}
                      title={`${item.kunde} - ${item.produkt} (${item.supplyCenter}): ${value}`}
                    />
                  );
                })}
              </div>
              <div className="total-label">
                Total: {yearlyTotals[year].toFixed(1)}
              </div>
            </div>
          ))}
        </div>
        <div className="legend">
          {filteredData.map((item, index) => (
            <div key={`legend-${index}`} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)` }}
              />
              <span>{item.kunde} - {item.produkt} ({item.supplyCenter})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="data-visualization">
      <div className="visualization-header">
        <h2>Sales Projection Data Analysis</h2>
        <p>Analyzed data from contracts and forecasts</p>
      </div>

      <div className="controls">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="kunde-filter">Kunde (Customer):</label>
            <select
              id="kunde-filter"
              value={selectedKunde}
              onChange={(e) => setSelectedKunde(e.target.value)}
            >
              <option value="All">All Customers</option>
              {uniqueKunden.map(kunde => (
                <option key={kunde} value={kunde}>{kunde}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="produkt-filter">Produkt (Product):</label>
            <select
              id="produkt-filter"
              value={selectedProdukt}
              onChange={(e) => setSelectedProdukt(e.target.value)}
            >
              <option value="All">All Products</option>
              {uniqueProdukte.map(produkt => (
                <option key={produkt} value={produkt}>{produkt}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="supply-center-filter">Supply Center:</label>
            <select
              id="supply-center-filter"
              value={selectedSupplyCenter}
              onChange={(e) => setSelectedSupplyCenter(e.target.value)}
            >
              <option value="All">All Supply Centers</option>
              {uniqueSupplyCenters.map(center => (
                <option key={center} value={center}>{center}</option>
              ))}
            </select>
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>

        <div className="view-controls">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={viewMode === 'chart' ? 'active' : ''}
            onClick={() => setViewMode('chart')}
          >
            Chart View
          </button>
        </div>
      </div>

      <div className="data-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total Records:</span>
            <span className="stat-value">{filteredData.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Customers:</span>
            <span className="stat-value">{new Set(filteredData.map(item => item.kunde)).size}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Products:</span>
            <span className="stat-value">{new Set(filteredData.map(item => item.produkt)).size}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Supply Centers:</span>
            <span className="stat-value">{new Set(filteredData.map(item => item.supplyCenter)).size}</span>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kunde</th>
                <th>Produkt</th>
                <th>Supply Center</th>
                {years.map(year => (
                  <th key={year}>{year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.kunde}</td>
                  <td>{item.produkt}</td>
                  <td>{item.supplyCenter}</td>
                  {years.map(year => (
                    <td key={year} className="numeric">
                      {item.data[year].toLocaleString('de-DE')}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length > 1 && (
                <tr className="totals-row">
                  <td colSpan={3}><strong>Total</strong></td>
                  {years.map(year => (
                    <td key={year} className="numeric total">
                      <strong>{yearlyTotals[year].toFixed(1)}</strong>
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        renderBarChart()
      )}

      {filteredData.length === 0 && (
        <div className="no-data">
          <p>No data matches the selected filters. Please adjust your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;