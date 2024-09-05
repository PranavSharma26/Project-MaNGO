import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data1 = [
  { name: 'Completed', value: 60 },
  { name: 'Pending', value: 20 },
  { name: 'In Progress', value: 20 }
];

const data2 = [
  { name: 'Active', value: 75 },
  { name: 'Inactive', value: 25 }
];

const data3 = [
  { name: 'Benefitted', value: 80 },
  { name: 'Non-benefitted', value: 20 }
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56'];

function HowItWorks() {
  return (
    <div className="p-6">
      {/* Layout container */}
      <div className="flex flex-col md:flex-row items-center md:justify-between">
        {/* Image and Description */}
        <div className="flex-1 md:mr-6">
          <img
            src="HowItWorks.png"
            alt="How it works"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4 text-center">How Our Application Works</h2>
          <p className="text-lg text-gray-600">
            Our application aims to simplify and enhance the process of distributing resources to those in need. Similar to Aahar, we focus on connecting donors with organizations that facilitate the distribution of essential items. We track and analyze data to improve efficiency and impact, ensuring that resources reach the people who need them the most.
          </p>
        </div>
      </div>

      {/* Pie charts */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Volunteers</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={data1}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Donations</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={data2}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data2.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">People Benefitted</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={data3}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data3.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
