import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
  deleteCart(): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const StorageProd = await AsyncStorage.getItem(
        '@GoMarkertplace:products',
      );

      if (StorageProd) {
        const productsParsed = JSON.parse(StorageProd) as Product[];

        setProducts(productsParsed);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const findProduct = products.find(item => item.id === product.id);

      if (findProduct) {
        findProduct.quantity += 1;

        const newProducts = [] as Product[];

        products.forEach(item => {
          if (item.id !== product.id) {
            newProducts.push(item);
          } else {
            newProducts.push(findProduct);
          }
        });

        setProducts(newProducts);
        AsyncStorage.setItem(
          '@GoMarkertplace:products',
          JSON.stringify(products),
        );
      } else {
        const newProduct: Product = {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price: product.price,
          quantity: 1,
        };

        setProducts([...products, newProduct]);
        AsyncStorage.setItem(
          '@GoMarkertplace:products',
          JSON.stringify([...products, newProduct]),
        );
      }
    },
    [products],
  );

  const deleteCart = useCallback(async () => {
    setProducts([]);
    await AsyncStorage.clear();
  }, []);

  const increment = useCallback(
    async id => {
      const findProduct = products.find(item => item.id === id);

      if (findProduct) {
        findProduct.quantity += 1;

        const newProducts = [] as Product[];

        products.forEach(item => {
          if (item.id !== id) {
            newProducts.push(item);
          } else {
            newProducts.push(findProduct);
          }
        });

        setProducts(newProducts);
        AsyncStorage.setItem(
          '@GoMarkertplace:products',
          JSON.stringify(newProducts),
        );
      }
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const findProduct = products.find(item => item.id === id);

      if (findProduct) {
        if (findProduct.quantity === 1) {
          const newProducts = products.filter(item => item.id !== id);

          setProducts(newProducts);
          AsyncStorage.setItem(
            '@GoMarkertplace:products',
            JSON.stringify(newProducts),
          );
        } else {
          findProduct.quantity -= 1;

          const newProducts = [] as Product[];

          products.forEach(item => {
            if (item.id !== id) {
              newProducts.push(item);
            } else {
              newProducts.push(findProduct);
            }
          });

          setProducts(newProducts);
          AsyncStorage.setItem(
            '@GoMarkertplace:products',
            JSON.stringify(newProducts),
          );
        }
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, deleteCart, products }),
    [products, addToCart, increment, decrement, deleteCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
