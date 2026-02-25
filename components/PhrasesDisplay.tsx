
import React from 'react';
import { Phrase } from '../types';

interface PhrasesDisplayProps {
  phrases: Phrase[] | null;
}

const PhrasesDisplay: React.FC<PhrasesDisplayProps> = ({ phrases }) => {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Essential Phrases</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {phrases.map((p, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.translation}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.phrase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhrasesDisplay;
