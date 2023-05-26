<?php

namespace App\Controller;

use App\Service\ApiFormatter;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Entity\Products;
use App\Repository\ProductsRepository;
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
    // Devuelve un usuario por id
    // #[Route('/users/{id}', name: 'app_api_users_show', methods:["GET"])]
    // public function userShow(ApiFormatter $apiFormatter, UserRepository $userRepository, User $user): JsonResponse
    // {
    //     if($user){
    //         $userJSON = $apiFormatter->userToArray($user);
    //     }
    //     return new JsonResponse($userJSON);
    // } 

    // Devuelve los productos
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
    // Devuelve un producto
    #[Route('/products/{id}', name: 'app_api_products_show', methods:["GET"])]
    public function productById(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, Products $products): JsonResponse
    {
        if($products){
            $productsJSON = $apiFormatter->productToArray($products);
        }
        return new JsonResponse($productsJSON);
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
