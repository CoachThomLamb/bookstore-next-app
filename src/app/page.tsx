import OrderForm from '@/components/OrderForm';
import { books } from '@/lib/books';

// This is a SERVER COMPONENT
// Book data is loaded on the server and passed to the client component
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Literature Order Form
        </h1>
        
        <OrderForm books={books} />
      </div>
    </div>
  );
}

