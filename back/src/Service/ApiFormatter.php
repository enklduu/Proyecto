<?php
namespace App\Service;

class ApiFormatter
{
    // Api con datos de todos los usuarios con sus pedidos y valoraciones de productos
    public function data($user): array
    {
        $userJSON=[];
        $orders = [];
        $orderProducts=[];
        $reviews = [];

        foreach ($user->getOrders() as $order) {
            $obj = new \stdClass();
            $obj -> id = $order->getId();
            $obj -> total_price = $order->getTotalPrice();
            $obj -> date = $order->getDate();
            foreach ($order->getOrdersProducts() as $orderproduct) {
                $obj2 = new \stdClass();
                // $obj2 -> id = $orderproduct->getId();
                $obj2 -> id_product = $orderproduct->getProduct()->getId();
                $obj2 -> price = $orderproduct->getProduct()->getPrice();
                $obj2 -> img = $orderproduct->getProduct()->getImg();
                $obj2 -> amount = $orderproduct->getAmount();
                $orders_product[]=($obj2);
            }
            $obj -> order_products = $orders_product;
            $orders[]=($obj);
        }

        foreach ($user->getReviews() as $reviews) {

            $obj = new \stdClass();
            // $obj -> id = $userProducts->getId();
            $reviews[]=($obj);
        }

        $userJSON = array(
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'name' => $user->getName(),
        'last_name' => $user->getLastName(),
        'valoration' => $user->getValoration(),
        'show_valoration' => $user->isShowValoration(),
        'orders' => $orders,
        'reviews' => $reviews,  
    );
    return $userJSON;
    }
    public function productToArray($product): array
    {
        $productJSON= array(
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => round($product->getPrice(),2),
            'visible' => $product->isVisible(),
            'images' => $product->getImages(),
          );
          return $productJSON;
    }
}