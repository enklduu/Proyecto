<?php
namespace App\Service;

class ApiFormatter
{
    // Api con datos de todos los usuarios con sus pedidos y valoraciones de productos
    public function data($user): array
    {
        $userJSON=[];
        $orders = [];
        $reviews = [];
        foreach ($user->getOrders() as $order) {
            $obj = new \stdClass();
            $obj -> id = $order->getId();
            $obj -> total_price = $order->getTotal();
            $obj -> date = $order->getDate();
            $obj -> status = $order->getStatus();
            foreach ($order->getOrderProducts() as $orderproduct) {
                $obj2 = new \stdClass();
                // $obj2 -> id = $orderproduct->getId();
                $obj2 -> id_product = $orderproduct->getProduct()->getId();
                $obj2 -> name = $orderproduct->getProduct()->getName();
                $obj2 -> price = $orderproduct->getProduct()->getPrice();
                $obj2 -> img = $orderproduct->getProduct()->getImg();
                $obj2 -> amount = $orderproduct->getAmount();
                $orders_product[]=($obj2);
            }
            $obj -> order_products = $orders_product;
            $orders[]=($obj);
        }

        foreach ($user->getReviews() as $review) {

            $obj = new \stdClass();
            $obj -> text = $review->getText();
            $obj -> valoration = $review->getValoration();
            $obj -> visible = $review->isVisible();
            $reviews[]=($obj);
        }

        $userJSON = array(
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'name' => $user->getName(),
        'last_name' => $user->getLastName(),
        'valoration' => $user->getValoration(),
        'show_valoration' => $user->isShowValoration(),
        'roles' => $user->getRoles(),
        'orders' => $orders,
        'reviews' => $reviews,
        'img' => $user->getImg(),  
    );
    return $userJSON;
    }

    // Método para parsear la categoria 
    public function categoryToArray($category): array
    {
        $categoryJSON= array(
            'id' => $category->getId(),
            'name' => $category->getName(),
            'visible' => $category->getVisible(),
          );
          return $categoryJSON;
    }
    // Método para parsear las review
    public function reviewToArray($review): array
    {
        $reviewJSON= array(
            'id' => $review->getId(),
            'user' => $review->getUser()->getEmail(),
            'product' => $review->getProduct()->getName(),
            'text' => $review->getText(),
            'visible' => $review->isVisible(),
            'valoration' => $review->getValoration(),
            );
        return $reviewJSON;
    }

      // Método para parsear orders 
    public function orderToArray($order): array
    {
        $orderProducts=[];

        foreach ($order->getOrderProducts() as $orderproduct) {
            $obj = new \stdClass();
            $obj -> id = $orderproduct->getProduct()->getId();
            $obj -> name = $orderproduct->getProduct()->getName();
            $obj -> price = $orderproduct->getProduct()->getPrice();
            $obj -> img = $orderproduct->getProduct()->getImg();
            $obj -> amount = $orderproduct->getAmount();
            $orderProducts[]=($obj);
        }

        $orderJSON= array(
            'id' => $order->getId(),
            'total' => $order->getTotal(),
            'date' => $order->getDate(),
            'status'=> $order->getStatus(),
            'user' => $order->getUser()->getEmail(),
            'orderProducts' => $orderProducts,
          );
          return $orderJSON;
    }

     // Método para sacar producto
    public function productToArray($product): array
    {
        $reviews = [];
        $categories = [];
        foreach ($product->getReviews() as $review) {

            $obj = new \stdClass();
            $obj -> visible = $review->isVisible();
            $obj -> text = $review->getText();
            $obj -> user = $review->getUser()->getId();
            $obj -> userName = $review->getUser()->getName();
            $obj -> valoration = $review->getValoration();
            $reviews[]=($obj);
        }
        foreach ($product->getCategories() as $category) {

            $obj = new \stdClass();
            $obj -> id = $category->getId();
            $obj -> name = $category->getName();
            $obj -> visible = $category->getVisible();
            $categories[]=($obj);
        }
        
        $productJSON= array(
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => round($product->getPrice(),2),
            'visible' => $product->isVisible(),
            'img' => $product->getImg(),
            'stock' => $product->getStock(),
            'reviews' => $reviews,
            'categories' => $categories,
          );
          return $productJSON;
    }

    
}