import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

export default function CompanyPrep() {
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => api.get('/api/companies').then(res => res.data)
  });

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {companies?.map(company => (
        <div key={company._id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
          <div className="space-y-2">
            <p className="text-sm font-medium">Common Questions:</p>
            <ul className="list-disc pl-4">
              {company.questions.slice(0, 5).map((q, i) => (
                <li key={i} className="text-sm">{q}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}