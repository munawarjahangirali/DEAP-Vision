
interface UserHistory {
  date: string;
  action: string;
  description: string;
}

interface UserHistoryTableProps {
history: UserHistory[];
}


const UserHistoryTable: React.FC<UserHistoryTableProps> = ({ history }) => {
return (
  <div className="rounded-md border">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {history.map((item, index) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.action}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default UserHistoryTable;