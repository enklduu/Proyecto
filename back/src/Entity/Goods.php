<?php

namespace App\Entity;

use App\Repository\GoodsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GoodsRepository::class)]
class Goods
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $stock = null;

    #[ORM\ManyToOne(inversedBy: 'goods')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Products $product = null;

    #[ORM\ManyToOne(inversedBy: 'goods')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Shop $shop = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getProduct(): ?Products
    {
        return $this->product;
    }

    public function setProduct(?Products $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getShop(): ?Shop
    {
        return $this->shop;
    }

    public function setShop(?Shop $shop): self
    {
        $this->shop = $shop;

        return $this;
    }
}
