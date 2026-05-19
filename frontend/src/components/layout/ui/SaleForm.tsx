import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Search } from "lucide-react";
import { getCustomers } from "../../../services/customerService";
import { getSellers } from "../../../services/sellerService";
import { getProducts } from "../../../services/productService";
import type { Seller } from "../../../types/Seller";
import type { Customer } from "../../../types/Customer";
import type { Product } from "../../../types/Product";
import type { Sale, SaleItem } from "../../../types/Sale";

interface SaleFormProps {
  initialData?: Sale | null;
  onSave: (payload: any) => Promise<void>;
  title: string;
}

export default function SaleForm({ initialData, onSave, title }: SaleFormProps) {
  const navigate = useNavigate();
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [items, setItems] = useState<SaleItem[]>(initialData?.items || []);
  const [selectedSeller, setSelectedSeller] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<number>(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [formError, setFormError] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [c, s, p] = await Promise.all([getCustomers(), getSellers(), getProducts()]);
      setCustomers(c);
      setSellers(s);
      setProducts(p);

      if (initialData) {
        setItems(initialData.items);
        const sId = typeof initialData.seller === 'object' ? (initialData.seller as any).id : Number(initialData.seller);
        const cId = typeof initialData.customer === 'object' ? (initialData.customer as any).id : Number(initialData.customer);
        setSelectedSeller(sId);
        setSelectedCustomer(cId);
      }
    }
    loadData();
  }, [initialData]);

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionRef.current) {
      const activeElement = suggestionRef.current.children[focusedIndex] as HTMLElement;
      activeElement?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setSelectedProduct(null);
    setFocusedIndex(-1);
    if (val.trim().length > 0) {
      const filtered = products.filter(p => 
        p.code.toLowerCase().includes(val.toLowerCase()) || 
        p.description.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectProduct = (p: Product) => {
    setSearchQuery(p.description);
    setSelectedProduct(p);
    setShowSuggestions(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0) handleSelectProduct(filteredProducts[focusedIndex]);
    } else if (e.key === "Escape") setShowSuggestions(false);
  };

  const handleAddItem = () => {
    if (!selectedProduct) return true;
    const unitPrice = parseFloat(selectedProduct.unit_price);
    const newItem: SaleItem = {
      id: Math.random(),
      product: selectedProduct.id,
      product_description: selectedProduct.description,
      quantity: quantityToAdd,
      unit_price: unitPrice,
      total_value: unitPrice * quantityToAdd
    };
    setItems([...items, newItem]);
    setSearchQuery("");
    setSelectedProduct(null);
    setQuantityToAdd(1);
  };

  const totalGeral = items.reduce((acc, item) => acc + item.total_value, 0);

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    const updated = [...items];
    updated[index].quantity = newQuantity;
    updated[index].total_value =
      updated[index].unit_price * newQuantity;

    setItems(updated);
  };

  const handleSubmit = async () => {
    const hasError =
      !selectedSeller || !selectedCustomer || items.length === 0;
    if (hasError) {
      setFormError(true);
      return;
    }
    setFormError(false);
    const payload = {
      customer: Number(selectedCustomer),
      seller: Number(selectedSeller),
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
      })),
    };
    await onSave(payload);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 border-b">
        <div className="text-2xl font-bold text-teal-700 italic">{title}</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 mt-4 text-gray-800">Produtos</h3>
          <div className="flex gap-4 mb-10 items-end relative">
            <div className="flex-1 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Buscar Produto</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full text-sm border-b border-gray-300 py-2 pl-2 pr-8 outline-none focus:border-teal-600 bg-transparent" 
                  placeholder="Código ou descrição..." 
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                />
                <Search className="absolute right-2 top-2 text-gray-300" size={18} />
              </div>
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-100 rounded-md shadow-xl mt-1 max-h-64 overflow-y-auto" ref={suggestionRef}>
                  {filteredProducts.map((p, idx) => (
                    <div key={p.id} onClick={() => handleSelectProduct(p)} className={`px-4 py-3 cursor-pointer flex justify-between items-center border-b last:border-0 text-sm ${focusedIndex === idx ? "bg-teal-100" : "hover:bg-teal-50"}`}>
                      <div>
                        <p className="font-bold text-gray-700">{p.description}</p>
                        <p className="text-[10px] text-gray-400">CÓD: {p.code}</p>
                      </div>
                      <span className="text-teal-700 font-bold">R$ {parseFloat(p.unit_price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-24">
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Quantidade</label>
              <input type="number" className="w-full text-sm border-b border-gray-300 py-2 outline-none text-center" value={quantityToAdd} onChange={(e) => setQuantityToAdd(Number(e.target.value))} min="1" />
            </div>
            <button onClick={handleAddItem} className="bg-teal-800 text-white px-2 py-2 rounded uppercase text-xs font-black hover:bg-teal-900 h-[35px]">Adicionar</button>
          </div>

          <div className={`max-h-80 overflow-y-auto custom-scroll rounded-md`}>
            {formError && items.length === 0 && (
              <p className="text-red-500 text-xs border-red-500">
                *Adicione pelo menos um produto para continuar
              </p>
            )}
            <table className="w-full text-sm table-fixed">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="text-left text-gray-400 uppercase text-[10px] border-b">
                  <th className="py-3 w-[45%]">Produtos</th>
                  <th className="py-3 w-[15%] text-center">Quantidade</th>
                  <th className="py-3 w-[15%] text-center">Valor Unitário</th>
                  <th className="py-3 w-[15%] text-center">Total</th>
                  <th className="py-3 w-[10%] text-center">Ação</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b text-[12px] last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-2 text-gray-600 font-medium truncate">
                      {item.product_description}
                    </td>
                    <td className="py-2 text-center">
                      {editingIndex === idx ? (
                        <input
                          type="number"
                          min="1"
                          autoFocus
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(idx, Number(e.target.value))
                          }
                          onBlur={() => setEditingIndex(null)}
                          className="w-16 text-center border-b border-gray-300 outline-none"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="py-2 text-gray-600 text-center">
                      R$ {Number(item.unit_price).toFixed(2)}
                    </td>
                    <td className="py-2 font-bold text-gray-800 text-center">
                      R$ {Number(item.total_value).toFixed(2)}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setEditingIndex(idx)}
                          className="text-gray-400 hover:text-blue-600 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setItems(items.filter((_, i) => i !== idx))
                          }
                          className="text-gray-300 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 h-fit sticky top-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Dados da venda</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Data</label>
              <input type="text" disabled value={initialData ? new Date(initialData.date).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR')} className="w-full bg-white border border-gray-200 rounded-md p-2 text-gray-400 text-xs" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Vendedor</label>
                <select className={`w-full text-xs bg-white border rounded-md p-2 outline-none text-sm focus:ring-2 focus:ring-teal-500 ${formError && !selectedSeller ? "border-red-500" : "border-gray-300"}`} value={selectedSeller} onChange={(e) => setSelectedSeller(Number(e.target.value))}>
                <option value={0}>Selecione...</option>
                {sellers.map(s => <option key={s.id} value={s.id}>{String(s.id).padStart(3, '0')} - {s.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cliente</label>
              <select className={`w-full text-xs bg-white border rounded-md p-2 outline-none text-sm focus:ring-2 focus:ring-teal-500 ${formError && !selectedCustomer ? "border-red-500" : "border-gray-300"}`} value={selectedCustomer} onChange={(e) => setSelectedCustomer(Number(e.target.value))}>
                <option value={0}>Selecione...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{String(c.id).padStart(3, '0')} - {c.name}</option>)}
              </select>
            </div>
            <div className="pt-8 border-t space-y-6">
              <div className="flex flex-col mb-10">
                <span className="text-gray-500 text-lg font-bold text-xs uppercase">Total da venda</span>
                <span className="text-3xl font-black  text-right text-teal-900">R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-teal-700 active:scale-95 transition-all"
                >
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}