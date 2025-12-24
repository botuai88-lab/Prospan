import React from 'react';
import { ProspanDocument, DocumentType } from '../types';
import { EyeIcon, TrashIcon, BeakerIcon, ScaleIcon, DocumentTextIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

interface DocumentListProps {
  documents: ProspanDocument[];
  onView: (doc: ProspanDocument) => void;
  onDelete: (id: string) => void;
}

const getTypeIcon = (type: DocumentType) => {
  switch (type) {
    case DocumentType.CLINICAL_STUDY: return <BeakerIcon className="h-5 w-5 text-blue-500" />;
    case DocumentType.LEGAL: return <ScaleIcon className="h-5 w-5 text-red-500" />;
    case DocumentType.MARKETING: return <MegaphoneIcon className="h-5 w-5 text-orange-500" />;
    default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
};

const DocumentList: React.FC<DocumentListProps> = ({ documents, onView, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên tài liệu</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm XB</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành phần chính</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                  Không tìm thấy tài liệu nào. Hãy tải lên dữ liệu để bắt đầu.
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                         {getTypeIcon(doc.type)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={doc.metadata.title}>{doc.metadata.title}</div>
                        <div className="text-xs text-gray-500">{doc.fileName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doc.metadata.publicationDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {doc.metadata.ingredients?.slice(0, 2).join(", ") || "N/A"}
                     {(doc.metadata.ingredients?.length || 0) > 2 && "..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => onView(doc)}
                        className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 p-1.5 rounded-md"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(doc.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;