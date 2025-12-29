import React, { useState, useEffect } from "react";
import Chart, { Props } from "react-apexcharts";
import { AsicRorSummaryResponse } from "@/types";

interface RORStatsProps {
  rorData: AsicRorSummaryResponse;
}

export default function RORStats({ rorData }: RORStatsProps) {
  const { items } = rorData.data;
  const [isDark, setIsDark] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Aggregated ROR Stats</h2>
        <p className="text-gray-600 dark:text-gray-300">Track your mining performance and returns</p>
      </div>

      {/* Per-ASIC Breakdown */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <span className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">⚡</span>
          ASIC Performance Breakdown
        </h3>
        <div className="grid grid-cols-1 gap-8">
          {(() => {
            const item = items[selectedIndex];
            const { summary, chart } = item;
            const chartData = chart.map(point => ({
              x: new Date(point.date).getTime(),
              y: point.earningsUsd
            }));

            const options: Props["options"] = {
              theme: {
                mode: 'dark'
              },
              chart: {
                type: "area",
                height: 300,
                toolbar: {
                  show: false,
                },
                background: 'transparent',
              },
              colors: ['#3B82F6', '#10B981'],
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  type: 'vertical',
                  shadeIntensity: 0.25,
                  gradientToColors: ['#3B82F6'],
                  inverseColors: false,
                  opacityFrom: 0.85,
                  opacityTo: 0.25,
                  stops: [0, 100],
                },
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: 'smooth',
                width: 3,
              },
              xaxis: {
                type: "datetime",
                labels: {
                  format: "MMM dd",
                  style: {
                    colors: '#9CA3AF',
                  },
                },
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
              },
              yaxis: {
                title: {
                  text: "Earnings (USD)",
                  style: {
                    color: '#9CA3AF',
                  },
                },
                labels: {
                  style: {
                    colors: '#9CA3AF',
                  },
                },
              },
              grid: {
                show: true,
                borderColor: isDark ? '#374151' : '#E5E7EB',
                strokeDashArray: 3,
              },
              tooltip: {
                theme: 'dark',
                x: {
                  format: 'MMM dd, yyyy',
                },
                y: {
                  formatter: (value) => `$${value.toFixed(2)}`,
                },
              },
            };

            const series: Props["series"] = [
              {
                name: "Daily Earnings",
                data: chartData,
              },
            ];

            return (
              <div key={selectedIndex} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <select
                      className="p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold"
                      value={selectedIndex}
                      onChange={(e) => {
                        setSelectedIndex(Number(e.target.value));
                        e.target.blur();
                      }}
                    >
                      {items.map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.summary.asic_model} ({item.summary.asic_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">ASIC ID: {summary.asic_id}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Purchase Price</p>
                      <p className="font-semibold text-gray-800 dark:text-white">${summary.purchase_price_usd.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Total Earnings</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">${summary.total_earnings_usd.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Current ROR</p>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">{summary.current_ror_percentage.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Timeframe ROR</p>
                      <p className="font-semibold text-purple-600 dark:text-purple-400">{summary.timeframe_ror.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
                <Chart options={options} series={series} type="area" height={300} />
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}