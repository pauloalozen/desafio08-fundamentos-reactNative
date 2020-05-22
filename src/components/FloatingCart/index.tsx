import React, { useState, useMemo } from 'react';

import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
  ClearCartButton,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products, deleteCart } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    let totalPrice = 0;

    products.forEach(item => {
      totalPrice += item.quantity * item.price;
    });

    return formatValue(totalPrice);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    let totalItens = 0;

    products.forEach(item => {
      totalItens += item.quantity;
    });

    return totalItens;
  }, [products]);

  const clearCart = async (): Promise<void> => {
    try {
      await deleteCart();
      Alert.alert('Aviso', 'Carrinho eliminado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Carrinho não eliminado.');
    }
  };

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>
      <ClearCartButton onPress={clearCart}>Excluir Carrinho</ClearCartButton>
      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
