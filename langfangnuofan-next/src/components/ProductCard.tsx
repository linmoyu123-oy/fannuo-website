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
      className="card group cursor-pointer"
      onClick={() => onDetail?.(product)}
    >
      <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <span className="text-gray-400 text-sm">暂无图片</span>
        )}
        {product.category_name && (
          <span className="absolute top-3 left-3 badge-primary">{product.category_name}</span>
        )}
        <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-2 truncate group-hover:text-primary-700 transition-colors">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
}
