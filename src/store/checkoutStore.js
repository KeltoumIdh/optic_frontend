import { create } from "zustand";

const useCheckoutStore = create((set) => ({
    clientId: "",
    cart: {},
    selectedProd: [],
    etatPayment: "",
    isCredit: false,
    date: "",
    prixPayee: "",
    prixReste: "",
    setCartI: (cart) => set({ cart }),
    setSelectedProd: (selectedProd) => set({ selectedProd }),
    removeFromSelectedProd: (productId) => {
        set((prev) => ({
            selectedProd: prev.selectedProd.filter((id) => id !== productId),
        }));
    },
    setClient: (clientId) => set({ clientId }),
    setEtatPayment: (etatPayment) => set({ etatPayment }),
    setisCred: (isCredit) => set({ isCredit }),
    setDate: (date) => set({ date }),
    setPrixPayee: (prixPayee) => set({ prixPayee }),
    setPrixReste: (prixReste) => set({ prixReste }),
}));

export default useCheckoutStore;
