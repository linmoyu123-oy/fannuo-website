'use client';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category_id: number;
  specs: string;
  category_name?: string;
}

export default function ProductCard({ product, onDetail }: { product: Product; onDetail?: (p: Product) => void }) {
  return (
    <div
      className="card cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200"
      onClick={() => onDetail?.(product)}
    >
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-gray-400 text-sm">暂无图片</span>
        )}
      </div>
      <div className="p-4">
        {product.category_name && (
          <span className="inline-block bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full mb-2">
            {product.category_name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mb-1.5 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
}
