<?php

namespace App\Controller;

use App\Service\ApiFormatter;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Products;
use App\Entity\Order;
use App\Entity\Review;
use App\Entity\Category;
use App\Entity\OrderProduct;
use App\Repository\UserRepository;
use App\Repository\ReviewRepository;
use App\Repository\ProductsRepository;
use App\Repository\CategoryRepository;
use App\Repository\OrderRepository;
use App\Repository\OrderProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;

#[Route('/api')]
class ApiController extends AbstractController
{
    // Devuelve todos los datos de todos los usuarios
    #[Route('/data', name: 'app_api_data', methods: ["GET"])]
    public function usersIndex(Request $request, UserRepository $userRepository, Apiformatter $apiFormatter): JsonResponse
    {
        $users = $userRepository->findAll();
        $usersJSON = [];

        foreach ($users as $user) {
            $usersJSON[] = $apiFormatter->data($user);
        }
        return new JsonResponse($usersJSON);
    }

    // Crea un nuevo usuario
    #[Route('/register', name: 'app_api_create_user', methods: ["POST"])]
    public function createUser(Request $request, UserPasswordHasherInterface $userPasswordHasher, UserRepository $userRepository, Apiformatter $apiFormatter, ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $data = json_decode($request->getContent(), true);

        if ($userRepository->findOneByEmail($data['email'])) {

            return new JsonResponse("Ese correo ya esta en uso", 500);

        } else {
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

    // Edita al usuario (cambia rol)
    #[Route('/user/{id}', name: 'app_api_edit_user', methods: ["PUT"])]
    public function userEdit(ApiFormatter $apiFormatter, UserRepository $userRepository, User $user): JsonResponse
    {
        $roles = $user->getRoles();

        if (in_array('ROLE_ADMIN', $roles)) {
            // Si el usuario ya tiene el rol ROLE_ADMIN, lo eliminamos
            $roles = array_diff($roles, ['ROLE_ADMIN']);
        } else {
            // Si el usuario no tiene el rol ROLE_ADMIN, lo añadimos
            $roles[] = 'ROLE_ADMIN';
        }

        $user->setRoles($roles);
        $userRepository->save($user, true);
        $userJSON = $apiFormatter->data($user);
        return new JsonResponse($userJSON);
    }

    // Devuelve todos los productos
    #[Route('/products', name: 'app_api_products_index', methods: ["GET"])]
    public function productsIndex(ApiFormatter $apiFormatter, ProductsRepository $productsRepository): JsonResponse
    {
        $products = $productsRepository->findAll();
        $productsJSON = [];
        foreach ($products as $product) {
            $productsJSON[] = $apiFormatter->productToArray($product);
        }
        return new JsonResponse($productsJSON);
    }
    // Devuelve un producto
    #[Route('/products/{id}', name: 'app_api_product_show', methods: ["GET"])]
    public function productById(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, Products $product): JsonResponse
    {
        if ($product) {
            $productJSON = $apiFormatter->productToArray($product);
        }
        return new JsonResponse($productJSON);
    }
    //Cambia la img del producto
    #[Route('/products/{id}', name: 'app_api_product_img', methods: ["POST"])]
    public function imgProduct(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, Products $product, Request $request): JsonResponse
    {
        $imageFile = $request->files->get('image');

        // Verificar si se ha enviado un archivo
        if ($imageFile instanceof UploadedFile) {
            $sourcePath = $imageFile->getPathname();
            $filename = uniqid() . '.' . $imageFile->guessExtension();
            $destinationPath = '../../front/public/images/products/' . $filename;

            // Copiar el archivo al directorio de front-end
            if (copy($sourcePath, $destinationPath)) {
                // Guardar en la base de datos
                $product->setImg($filename);
                $productsRepository->save($product, true);
                $productJSON = $apiFormatter->productToArray($product);

                // Devolver una respuesta adecuada
                return new JsonResponse($productJSON);
            } else {
                // Devolver una respuesta de error si no se pudo copiar el archivo
                return $this->json(['error' => 'No se pudo guardar la imagen.'], 500);
            }
        }

        // Devolver una respuesta de error si no se ha enviado un archivo
        return $this->json(['error' => 'No se ha seleccionado ninguna imagen.'], 400);
    }

    // Cambiar datos del product
    #[Route('/products/{id}', name: 'app_api_product_edit', methods: ["PUT"])]
    public function editProductById(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, CategoryRepository $categoryRepository, Products $product, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setVisible($data['visible']);
        $product->setStock($data['stock']);

        // Eliminamos todas las categorías
        foreach ($product->getCategories() as $category) {
            $product->removeCategory($category);
        }

        // Agregamos las nuevas categorías al producto
        foreach ($data['categories'] as $categoryData) {
            $categoryId = $categoryData['id'];
            $category = $categoryRepository->find($categoryId);
            if ($category) {
                $product->addCategory($category);
            }
        }

        $productsRepository->save($product, true);
        $productJSON = $apiFormatter->productToArray($product);
        return new JsonResponse($productJSON);
    }


    // Crear nuevo producto
    #[Route('/new-product', name: 'app_api_new_product', methods: ["POST"])]
    public function newProduct(ApiFormatter $apiFormatter, ProductsRepository $productsRepository, CategoryRepository $categoryRepository, Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $name = $request->request->get('name');
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $visible = $request->request->get('visible');
        $stock = $request->request->get('stock');
        $categories = json_decode($request->request->get('categories'), true);
        $imageFile = $request->files->get('img');

        // return new JsonResponse($categories);
        // Verificar si se ha enviado un archivo
        if ($imageFile instanceof UploadedFile) {
            $sourcePath = $imageFile->getPathname();
            $filename = uniqid() . '.' . $imageFile->guessExtension();
            $destinationPath = '../../front/public/images/products/' . $filename;

            // Copiar el archivo al directorio de front-end
            if (copy($sourcePath, $destinationPath)) {
                // Guardar en la base de datos
                $product = new Products();
                $product->setImg($filename);
                $product->setName($name);
                $product->setDescription($description);
                $product->setPrice($price);
                $product->setVisible($visible);
                $product->setStock($stock);

                // Agregamos las nuevas categorías al producto
                foreach ($categories as $category) {
                    $categoryId = $category['id'];
                    $category = $categoryRepository->find($categoryId);
                    if ($category) {
                        $product->addCategory($category);
                    }
                }

                // Guardar el nuevo usuario en la base de datos
                $entityManager->persist($product);
                $entityManager->flush();

                // Devolver una respuesta al cliente React
                $productJSON = $apiFormatter->productToArray($product);

                // Devolver una respuesta adecuada
                return new JsonResponse($productJSON);
            } else {
                // Devolver una respuesta de error si no se pudo copiar el archivo
                return $this->json(['error' => 'No se pudo guardar la imagen.'], 500);
            }
        }

        // Devolver una respuesta de error si no se ha enviado un archivo
        return $this->json(['error' => 'No se ha seleccionado ninguna imagen.'], 400);
    }

    // Devuelve todas las categorías
    #[Route('/category', name: 'app_api_categories', methods: ["GET"])]
    public function categoriesIndex(ApiFormatter $apiFormatter, CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findAll();
        $categoryJSON = [];
        foreach ($categories as $category) {
            $categoryJSON[] = $apiFormatter->categoryToArray($category);
        }
        return new JsonResponse($categoryJSON);
    }

    // Cambiar visible a las categorías
    #[Route('/category/{id}', name: 'app_api_category_edit', methods: ["PUT"])]
    public function editCategoryById(ApiFormatter $apiFormatter, CategoryRepository $categoryRepository, Category $category): JsonResponse
    {
        $visible = $category->getVisible();
        if ($visible) {
            $visible = 0;
        } else {
            $visible = 1;
        }
        $category->setVisible($visible);
        $categoryRepository->save($category, true);
        $categoryJSON = $apiFormatter->categoryToArray($category);
        return new JsonResponse($categoryJSON);
    }

    // Devuelve todos los pedidos 
    #[Route('/orders', name: 'app_api_orders', methods: ["GET"])]
    public function ordersIndex(ApiFormatter $apiFormatter, OrderRepository $orderRepository): JsonResponse
    {
        $orders = $orderRepository->findAll();
        $ordersJSON = [];
        foreach ($orders as $order) {
            $ordersJSON[] = $apiFormatter->orderToArray($order);
        }
        return new JsonResponse($ordersJSON);
    }

    // Devuelve un order
    #[Route('/orders/{id}', name: 'app_api_order_show', methods: ["GET"])]
    public function orderById(ApiFormatter $apiFormatter, Order $order): JsonResponse
    {
        if ($order) {
            $orderJSON = $apiFormatter->orderToArray($order);
        }
        return new JsonResponse($orderJSON);
    }

    // Crear o añadir al carrito (pedido con status 0)
    #[Route('/cart/add', name: 'app_api_cart_add', methods: ["POST"])]
    public function addOrder(Request $request, ApiFormatter $apiFormatter, OrderProductRepository $orderProductRepository, UserRepository $userRepository, ProductsRepository $productsRepository, OrderRepository $orderRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $productId = $data['productId'];

        $order = $orderRepository->findActiveOrder($userId);
        if (!$order) {
            // Si no hay un pedido activo, crea uno nuevo
            $order = new Order();
            // Creamos un orderProduct con el producto y el pedido creado y lo agregamos el producto al pedido
            $product = $productsRepository->find($productId);

            $orderProduct = new OrderProduct();
            $orderProduct->setIndent($order);
            $orderProduct->setProduct($product);
            $orderProduct->setAmount(1);

            $order->addOrderProduct($orderProduct);
            $order->setUser($userRepository->find($userId));
            $order->setStatus(0);
            $order->setTotal($product->getPrice());
            $order->setDate(\DateTime::createFromFormat('Y-m-d', date('Y-m-d')));
            $orderRepository->save($order, true);
        } else {
            // Existe el pedido, así que comprobamos si existe ese producto en ese pedido o no para añadirlo o aumentar su cantidad en 1
            $product = $productsRepository->find($productId);

            $existingOrderProduct = $orderProductRepository->findByOrderAndProduct($order->getId(), $productId);
            if ($existingOrderProduct) {
                // El producto ya está en el pedido, incrementamos la cantidad en 1
                $existingOrderProduct->setAmount($existingOrderProduct->getAmount() + 1);
            } else {
                // El producto no está en el pedido, creamos un nuevo OrderProduct y lo agregamos al pedido
                $orderProduct = new OrderProduct();
                $orderProduct->setIndent($order);
                $orderProduct->setProduct($product);
                $orderProduct->setAmount(1);
                $order->addOrderProduct($orderProduct);
            }

            $order->setTotal($order->getTotal() + $product->getPrice());
            $orderRepository->save($order, true);
        }

        // Devolvemos la respuesta en formato JSON con los datos del pedido actualizado
        $responseData = [
            'total' => $order->getTotal(),
        ];

        return new JsonResponse($responseData);
    }

    // Quitar o restar del carrito (pedido con status 0)
    #[Route('/cart/remove', name: 'app_api_cart_remove', methods: ["POST"])]
    public function removeOrder(Request $request, ApiFormatter $apiFormatter, OrderProductRepository $orderProductRepository, UserRepository $userRepository, ProductsRepository $productsRepository, OrderRepository $orderRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $userId = $data['userId'];
        $productId = $data['productId'];

        $order = $orderRepository->findActiveOrder($userId);
        if (!$order) {
            return new JsonResponse("No hay pedido activo para este usuario");
        }

        $existingOrderProduct = $orderProductRepository->findByOrderAndProduct($order->getId(), $productId);
        if (!$existingOrderProduct) {
            return new JsonResponse("El producto no está en el pedido");
        }

        $existingAmount = $existingOrderProduct->getAmount();
        if ($existingAmount > 1) {
            // Reducir la cantidad en 1 si hay más de 1 producto en el pedido
            $existingOrderProduct->setAmount($existingAmount - 1);
        } else {
            // Eliminar el producto del pedido si solo hay 1 producto
            $order->removeOrderProduct($existingOrderProduct);
            $orderProductRepository->remove($existingOrderProduct);

            // Actualizar el stock del producto
            $productsRepository->updateProductStock($productId, 1); // Incrementar el stock en 1
        }

        // Actualizar el total del pedido
        $product = $productsRepository->find($productId);
        $order->setTotal($order->getTotal() - $product->getPrice());

        // Guardar los cambios en la base de datos
        $orderRepository->save($order, true);

        // Devolver la respuesta en formato JSON con los datos del pedido actualizado
        $responseData = [
            'total' => $order->getTotal(),
        ];

        return new JsonResponse($responseData);
    }

    // Cambiar status del order y devuelve el objeto user
    #[Route('/orders/{id}', name: 'app_api_order_edit', methods: ["PUT"])]
    public function editOrderById(ApiFormatter $apiFormatter, OrderRepository $orderRepository, Order $order, UserRepository $userRepository, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'];
        $order->setStatus($data['status']);
        $orderRepository->save($order, true);
        $user = $userRepository->findOneByEmail($email);
        $userJSON = $apiFormatter->data($user);
        return new JsonResponse($userJSON);
    }

    // Modifica el user
    #[Route('/valoration', name: 'app_api_valoration', methods: ["PUT"])]
    public function valoration(ApiFormatter $apiFormatter, UserRepository $userRepository, Request $request): JsonResponse
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
    // Modifica la imagen del user
    #[Route('/upload-image', name: 'app_api_upload-image', methods: ["POST"])]
    public function image(ApiFormatter $apiFormatter, UserRepository $userRepository, Request $request): JsonResponse
    {
        $imageFile = $request->files->get('image');
        $email = $request->request->get('email');

        $user = $userRepository->findOneByEmail($email);

        // Verificar si se ha enviado un archivo
        if ($imageFile instanceof UploadedFile) {
            $sourcePath = $imageFile->getPathname();
            $filename = uniqid() . '.' . $imageFile->guessExtension();
            $destinationPath = '../../front/public/images/users/' . $filename;

            // Copiar el archivo al directorio de front-end
            if (copy($sourcePath, $destinationPath)) {
                // Guardar en la base de datos
                $user->setImg($filename);
                $userRepository->save($user, true);
                $userJSON = $apiFormatter->data($user);

                // Devolver una respuesta adecuada
                return new JsonResponse($userJSON);
            } else {
                // Devolver una respuesta de error si no se pudo copiar el archivo
                return $this->json(['error' => 'No se pudo guardar la imagen.'], 500);
            }
        }

        // Devolver una respuesta de error si no se ha enviado un archivo
        return $this->json(['error' => 'No se ha seleccionado ninguna imagen.'], 400);
    }

    // Devuelve todas las reviews
    #[Route('/reviews', name: 'app_api_reviews', methods: ["GET"])]
    public function reviewsIndex(ApiFormatter $apiFormatter, ReviewRepository $reviewRepository): JsonResponse
    {
        $reviews = $reviewRepository->findAll();
        $reviewJSON = [];
        foreach ($reviews as $review) {
            $reviewJSON[] = $apiFormatter->reviewToArray($review);
        }
        return new JsonResponse($reviewJSON);
    }

    // Crear Review
    #[Route('/createReview', name: 'app_api_create_review', methods: ["POST"])]
    public function createReview(ApiFormatter $apiFormatter, UserRepository $userRepository, ProductsRepository $productsRepository, ReviewRepository $reviewRepository, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $text = $request->request->get('text');
        $valoration = $request->request->get('valoration');
        $user = $userRepository->findOneById($request->request->get('user'));
        $product = $productsRepository->findOneById($request->request->get('product'));

        // Crear Review y añadir cositas
        $review = new Review();
        $review->setText($text);
        $review->setValoration($valoration);
        $review->setUser($user);
        $review->setProduct($product);
        $review->setVisible(1);

        $reviewRepository->save($review, true);

        $reviewJSON = $apiFormatter->reviewToArray($review);

        return new JsonResponse($reviewJSON);
    }
    // Edita la review (cambia rol)
    #[Route('/reviews/{id}', name: 'app_api_edit_reviews', methods: ["PUT"])]
    public function reviewEdit(ApiFormatter $apiFormatter, ReviewRepository $reviewRepository, Review $review): JsonResponse
    {
        $visible = $review->isVisible();
        if ($visible) {
            $visible = 0;
        } else {
            $visible = 1;
        }
        $review->setVisible($visible);
        $reviewRepository->save($review, true);
        $reviewJSON = $apiFormatter->reviewToArray($review);
        return new JsonResponse($reviewJSON);
    }

    // Devuelve la valoración media de todos los usuarios en función a las votaciones
    #[Route('/average', name: 'app_api_average', methods: ["GET"])]
    public function average(ApiFormatter $apiFormatter, UserRepository $userRepository): JsonResponse
    {
        $data = $userRepository->getAverageValoration();
        return new JsonResponse($data);
    }

    // Devuelve la valoración media de todos los usuarios en función a las votaciones
    #[Route('/{email}', name: 'app_api_users_show', methods: ["GET"])]
    public function userByEmail(ApiFormatter $apiFormatter, UserRepository $userRepository, $email): JsonResponse
    {
        $user = $userRepository->findOneByEmail($email);
        $userJSON = "Este email no lo conozco";
        if ($user) {
            $userJSON = $apiFormatter->data($user);
        }
        return new JsonResponse($userJSON);
    }
}