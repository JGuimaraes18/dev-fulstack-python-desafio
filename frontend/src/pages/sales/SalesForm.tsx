import { useEffect, useState } from "react";
import { createSale } from "../../services/salesService";
import { getCustomers } from "../../services/customerService";
import { getSellers } from "../../services/sellerService";
import type { SaleCreatePayload } from "../../types/Sale";
import type { Customer } from "../../types/Customer";
import type { Seller } from "../../types/Seller";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function SalesForm({ onClose, onSuccess }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const [customerId, setCustomerId] = useState<string>("");
  const [sellerId, setSellerId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  // 🔒 trava scroll do background
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [customersData, sellersData] = await Promise.all([
          getCustomers(),
          getSellers(),
        ]);

        setCustomers(customersData);
        setSellers(sellersData);
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!customerId || !sellerId) return;

    const payload: SaleCreatePayload = {
      customer: Number(customerId),
      seller: Number(sellerId),
    };

    setLoading(true);

    try {
      await createSale(payload);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating sale:", error);
      alert("Error creating sale");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        <h2 className="text-xl font-semibold mb-6">
          New Sale
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CUSTOMER SELECT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* SELLER SELECT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Seller
            </label>
            <select
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select seller</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}