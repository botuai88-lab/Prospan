import React, { useState } from 'react';
import { DocumentType, ProspanDocument, ViewState, ChatMessage } from './types';
import Layout from './components/Layout';
import StatCard from './components/StatCard';
import DocumentList from './components/DocumentList';
import { semanticSearch } from './services/geminiService';
import { INITIAL_DOCUMENTS } from './constants';
import { 
  DocumentArrowUpIcon, 
  BeakerIcon, 
  UserGroupIcon, 
  SparklesIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Sub Components ---

const DetailView = ({ doc, onBack }: { doc: ProspanDocument, onBack: () => void }) => (
  <div className="space-y-6 animate-fade-in">
    <button onClick={onBack} className="text-sm text-gray-500 hover:text-emerald-600 flex items-center mb-4">
      ← Quay lại thư viện
    </button>

    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
        <div>
           <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-1 text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 rounded">{doc.type}</span>
              <span className="text-xs text-gray-400">{doc.uploadDate.split('T')[0]}</span>
           </div>
           <h1 className="text-3xl font-bold text-gray-900">{doc.metadata.title}</h1>
        </div>
        {doc.metadata.source && (
          <div className="text-right">
             <p className="text-xs text-gray-500 uppercase">Nguồn</p>
             <p className="font-medium text-gray-800">{doc.metadata.source}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">Tóm tắt</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              {doc.metadata.summary}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Kết quả lâm sàng</h3>
            <ul className="space-y-2">
              {doc.metadata.results?.map((res, i) => (
                 <li key={i} className="flex items-start">
                   <div className="flex-shrink-0 h-5 w-5 text-emerald-500 mr-2">•</div>
                   <span className="text-gray-700">{res}</span>
                 </li>
              )) || <p className="text-gray-500 italic">Không tìm thấy kết quả cụ thể.</p>}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-emerald-900 mb-2">Văn bản gốc</h3>
            <div className="h-64 overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200 text-sm font-mono text-gray-600 whitespace-pre-wrap">
              {doc.content}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100">
            <h4 className="font-semibold text-emerald-900 mb-3">Dữ liệu chính</h4>
            <div className="space-y-4 text-sm">
               <div>
                 <span className="block text-emerald-600 font-medium text-xs uppercase">Đối tượng</span>
                 <span className="text-gray-800">{doc.metadata.population || 'Không xác định'}</span>
               </div>
               <div>
                 <span className="block text-emerald-600 font-medium text-xs uppercase">Chỉ định</span>
                 <span className="text-gray-800">{doc.metadata.indications?.join(', ') || 'N/A'}</span>
               </div>
               <div>
                 <span className="block text-emerald-600 font-medium text-xs uppercase">Hoạt chất</span>
                 <span className="text-gray-800 font-bold">{doc.metadata.ingredients?.join(', ') || 'N/A'}</span>
               </div>
                <div>
                 <span className="block text-emerald-600 font-medium text-xs uppercase">Cơ chế</span>
                 <span className="text-gray-800">{doc.metadata.mechanism || 'N/A'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [documents, setDocuments] = useState<ProspanDocument[]>(INITIAL_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState<ProspanDocument | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleDocumentClick = (doc: ProspanDocument) => {
    setSelectedDoc(doc);
    setView(ViewState.DOCUMENT_DETAIL);
  };

  const handleDelete = (id: string) => {
    if(confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
       setDocuments(prev => prev.filter(d => d.id !== id));
       if (selectedDoc?.id === id) {
         setSelectedDoc(null);
         setView(ViewState.LIBRARY);
       }
    }
  };

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: searchQuery };
    setChatHistory(prev => [...prev, userMsg]);
    setIsSearching(true);
    setSearchQuery('');

    const { answer, citations } = await semanticSearch(userMsg.content, documents);
    
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: answer,
      citations
    };
    setChatHistory(prev => [...prev, aiMsg]);
    setIsSearching(false);
  };

  // --- Views ---

  const renderDashboard = () => {
    // Empty dummy data since we have no documents initially
    const chartData = [
      { name: 'Th1', studies: 0, sales: 0 },
      { name: 'Th2', studies: 0, sales: 0 },
      { name: 'Th3', studies: 0, sales: 0 },
      { name: 'Th4', studies: 0, sales: 0 },
      { name: 'Th5', studies: 0, sales: 0 },
    ];
    
    // Only show valid data if documents exist, otherwise show empty state or zeros
    const pieData = [
       { name: 'Nghiên cứu lâm sàng', value: documents.filter(d => d.type === DocumentType.CLINICAL_STUDY).length },
       { name: 'Marketing', value: documents.filter(d => d.type === DocumentType.MARKETING).length },
       { name: 'Hướng dẫn', value: documents.filter(d => d.type === DocumentType.GUIDELINE).length },
       { name: 'Pháp lý', value: documents.filter(d => d.type === DocumentType.LEGAL).length },
    ];
    // Filter out zero values for cleaner chart
    const activePieData = pieData.filter(d => d.value > 0);
    
    const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Tổng quan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Tổng tài liệu" value={documents.length} icon={DocumentArrowUpIcon} trend="" />
          <StatCard title="Nghiên cứu lâm sàng" value={documents.filter(d => d.type === DocumentType.CLINICAL_STUDY).length} icon={BeakerIcon} color="blue" />
          <StatCard title="Tổng bệnh nhân" value="0" icon={UserGroupIcon} color="indigo" />
          <StatCard title="Xử lý bởi AI" value={documents.length} icon={SparklesIcon} color="purple" />
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bổ nội dung</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={activePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {activePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-4 text-xs text-gray-500 flex-wrap">
                    {activePieData.map((e, i) => (
                      <div key={i} className="flex items-center m-1">
                         <span className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>
                         {e.name}
                      </div>
                    ))}
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động truy cập hàng tháng</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#ecfdf5'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 2px 10px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500">Chưa có dữ liệu. Vui lòng liên hệ quản trị viên để cập nhật cơ sở dữ liệu.</p>
          </div>
        )}
      </div>
    );
  };

  const renderSearch = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-4">
        {chatHistory.length === 0 && (
          <div className="text-center mt-20 opacity-50">
             <MagnifyingGlassIcon className="h-20 w-20 mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-medium text-gray-600">Hỏi Prospan Lib bất cứ điều gì</h3>
             <p className="text-gray-400">Thử ví dụ: "Prospan có an toàn cho trẻ sơ sinh không?" hoặc "So sánh Prospan với Ambroxol"</p>
          </div>
        )}
        {chatHistory.map((msg) => (
           <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-1">Nguồn:</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((cite, idx) => {
                         // Try to find title if citation is ID, otherwise display citation
                         const doc = documents.find(d => d.id === cite);
                         return (
                           <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                             {doc ? doc.metadata.title : cite}
                           </span>
                         );
                      })}
                    </div>
                  </div>
                )}
              </div>
           </div>
        ))}
        {isSearching && (
           <div className="flex justify-start">
             <div className="bg-gray-100 rounded-2xl rounded-bl-none p-4 flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
           </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSmartSearch} className="flex space-x-2">
           <input
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Đặt câu hỏi về các nghiên cứu, liều dùng, hoặc độ an toàn..."
             className="flex-1 border-0 bg-gray-50 rounded-lg px-4 focus:ring-2 focus:ring-emerald-500"
           />
           <button 
             type="submit" 
             disabled={!searchQuery.trim() || isSearching}
             className="bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
           >
             <PaperAirplaneIcon className="h-5 w-5" />
           </button>
        </form>
      </div>
    </div>
  );

  return (
    <Layout currentView={view} setView={setView}>
      {view === ViewState.DASHBOARD && renderDashboard()}
      {view === ViewState.LIBRARY && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-800">Thư viện tài liệu</h2>
          </div>
          <DocumentList 
            documents={documents} 
            onView={handleDocumentClick} 
            onDelete={handleDelete} 
          />
        </div>
      )}
      {view === ViewState.SEARCH && renderSearch()}
      {view === ViewState.DOCUMENT_DETAIL && selectedDoc && (
        <DetailView doc={selectedDoc} onBack={() => setView(ViewState.LIBRARY)} />
      )}
    </Layout>
  );
}