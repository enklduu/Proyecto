<?php

namespace App\Controller;

use App\Service\ApiFormatter;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Entity\Products;
use App\Entity\Order;
use App\Repository\ProductsRepository;
use App\Repository\CategoryRepository;
use App\Repository\OrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;

#[Route('/api')]
class ApiController extends AbstractController
{
    // Devuelve todos los datos de todos los usuarios
    #[Route('/data', name: 'app_api_data', methods:["GET"])]
    public function usersIndex(Request $request,UserRepository $userRepository, Apiformatter $apiFormatter): JsonResponse
    {
        $users = $userRepository->findAll();
        $usersJSON = [];

        foreach($users as $user) {
            $usersJSON[] = $apiFormatter->data($user);
        }
        return new JsonResponse($usersJSON);
    }

      // Crea un nuevo usuario
      #[Route('/register', name: 'app_api_create_user', methods:["POST"])]
      public function createUser(Request $request,UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository, Apiformatter $apiFormatter,ManagerRegistry $doctrine): JsonResponse
      {
          $entityManager=$doctrine->getManager();
          $data = json_decode($request->getContent(), true);

        if($userRepository->findOneByEmail($data['email'])){

          return new JsonResponse("Ese correo ya esta en uso", 500);
          
        }else{
          $user = new User();
          $user->setEmail($data['email']);
          $user->setName($data['name']);
          $user->setLastName($data['lastname']);
          $user->setRoles(['ROLE_USER']);
          $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $data['password']
            )
        );
          // Guardar el nuevo usuario en la base de datos
          $entityManager->persist($user);
          $entityManager->flush();
  
          // Devolver una respuesta al cliente React
          $userJSON = $apiFormatter->data($user);
          return new JsonResponse("Nuevo usuario registrado", 201);
      }
    }

    #[Route('/login', name: 'app_api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordEncoder, Apiformatter $apiFormatter): JsonResponse
    {
        // Obtener los datos de la petición
        $data = json_decode($request->getContent(), true);

        // Buscar al usuario en la base de datos por su email
        $user = $userRepository->findOneBy(['email' => $data['email']]);

        // Si el usuario no existe, devolver un error de autenticación
        if (!$user) {
            return new JsonResponse(false, 402);
        }

        // Verificar que la contraseña es correcta
        $goodPassword = $passwordEncoder->isPasswordValid($user, $data['password']);
        if (!$goodPassword) {
            return new JsonResponse(false, 401);
        }

        // Devolver los datos del usuario en formato JSON
        $userJSON = $apiFormatter->data($user);
        return new JsonResponse($userJSON, 201);
    }

    // Devuelve todos los productos
    #[Route('/products', name: 'app_api_products_index', methods:["GET"])]
    public function productsIndex(ApiFormatter $apiFormatter, ProductsRepository $productsRepository): JsonResponse
    {
        $products = $productsRepository->findAll();
        $productsJSON= [];
        foreach ($products as $product) {
            $productsJSON [] = $apiFormatter->productToArray($product);
        }
        return new JsonResponse($productsJSON);
    }
    // Devuelve los productos cuyas categorias se pasen como parámetro, se deben pasar separando con una coma y espacios a ambos lados
    #[Route('/products/{categories}', name: 'app_api_products_show', methods:["GET"])]
    public function productByCategories(ApiFormatter $apiFormatter, CategoryRepository $categoryRepository, ProductsRepository $productsRepository, Request $request): JsonResponse
    {
        $categoriesString = $request->attributes->get('categories');
        $categoryNames = explode(',', $categoriesString);
        
        $categories = [];
        foreach ($categoryNames as $categoryName) {
            $category = $categoryRepository->findOneByName($categoryName);
            if ($category) {
                $categories[] = $category;
            }
        }
        
        $products = [];
        if (!empty($categories)) {
            $products = $categories[0]->getProducts();
            for ($i = 1; $i < count($categories); $i++) {
                $products = array_intersect($products, $categories[$i]->getProducts());
            }
        }
        
        $productsJSON = [];
        foreach ($products as $product) {
            $productsJSON[] = $apiFormatter->productToArray($product);
        }
        
        return new JsonResponse($productsJSON);
    }

    //  // Devuelve un product
    //  #[Route('/products/{category}', name: 'app_api_products_show', methods:["GET"])]
    //  public function productById(ApiFormatter $apiFormatter, CategoryRepository $categoryRepository ,ProductsRepository $productsRepository, Request $request): JsonResponse
    //  {
    //     $categoryName = $request->attributes->get('category');
    //     $category = $categoryRepository->findOneByName($categoryName);
    //     $products = $category->getProducts();
    //     $productsJSON= [];
    //     foreach ($products as $product) {
    //         $productsJSON [] = $apiFormatter->productToArray($product);
    //     }
    //     return new JsonResponse($productsJSON);
    //  }

    // Devuelve todas las categorías
    #[Route('/category', name: 'app_api_categories', methods:["GET"])]
    public function categoriesIndex(ApiFormatter $apiFormatter, CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findAll();
        $categoryJSON= [];
        foreach ($categories as $category) {
            $categoryJSON [] = $apiFormatter->categoryToArray($category);
        }
        return new JsonResponse($categoryJSON);
    }

     // Devuelve todos los pedidos
    #[Route('/orders', name: 'app_api_orders', methods:["GET"])]
    public function ordersIndex(ApiFormatter $apiFormatter, OrderRepository $orderRepository): JsonResponse
    {
        $orders = $orderRepository->findAll();
        $ordersJSON= [];
        foreach ($orders as $order) {
            $ordersJSON [] = $apiFormatter->orderToArray($order);
        }
        return new JsonResponse($ordersJSON);
    }

    // Devuelve un order
    #[Route('/orders/{id}', name: 'app_api_order_show', methods:["GET"])]
    public function orderById(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, Order $order): JsonResponse
    {
        if($order){
            $orderJSON = $apiFormatter->orderToArray($order);
        }
        return new JsonResponse($orderJSON);
    }

    // Modifica el user
    #[Route('/valoration', name: 'app_api_valoration', methods:["PUT"])]
    public function valoration(ApiFormatter $apiFormatter, UserRepository $userRepository,Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $showValoration = $data['data']['show_valoration'] ?? null;
        $valoration = $data['data']['valoration'] ?? null;
        
        $user = $userRepository->findOneByEmail($data['data']['email']);

        if ($showValoration !== null) {
            $user->setShowValoration($showValoration);
        }
    
        if ($valoration !== null) {
            $user->setValoration($valoration);
        }

        $userRepository->save($user, true);

        $userJSON = $apiFormatter->data($user);

        return new JsonResponse($userJSON);
    }    

    // Devuelve un usuario por email
    #[Route('/{email}', name: 'app_api_users_show', methods:["GET"])]
    public function userByEmail(ApiFormatter $apiFormatter, UserRepository $userRepository, $email): JsonResponse
    {
        $user = $userRepository->findOneByEmail($email);
        $userJSON = "Este email no lo conozco";
        if($user){
            $userJSON = $apiFormatter->data($user);
        }
        return new JsonResponse($userJSON);
    }
}

