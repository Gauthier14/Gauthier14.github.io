---
title: WriterTalent
publishDate: 2020-05-05 00:00:00
img: /assets/writertalent/home.png
img_alt: Page d'acceuil WriterTalent
description: |
  Projet final de la formation O'clock
tags:
  - Symfony
  - SQL
  - React
---

WriterTalent est un site 100% **responsive** que mon équipe et moi avons réalisé pour le projet final de notre formation O'clock. Ce projet s'est déroulé en autonomie sur une durée d'un mois en **méthode SCRUM**. Le front est réalisé en JavaScript avec **React** et le back en PHP avec **Symfony**. 
  
Le site a pour but de mettre en relation des amateurs de lecture en quête de contenu à lire avec des écrivains en herbe recherchant à obtenir des avis de la communauté concernant leurs écrits. 
  
J'ai été chargé du développement de la partie back du site.  
Cela consistait notamment à :
- Modéliser et créer la **base de donnée**
- Mettre à disposition une **API REST CRUD sécurisée** à destination du front.
- Mise en place d'un système d'authentification et d'autorisation
- Créer un interface backoffice **sécurisé**

#### La base de donnée : 

![MCD](/assets/writertalent/MCD.png) ![BDD](/assets/writertalent/BDD.png)

#### API REST CRUD :  
Voici ci dessous quelques extraits de code :  
1) Création d'un écrit (table Post)
```php
    /**
     * @Route("/api/post", name="api_post_create_item", methods={"POST"})
     * @isGranted("ROLE_USER", message="Vous devez être connecté")
     */
    public function createItem(Request $request, SerializerInterface $serializer, ManagerRegistry $doctrine, ValidatorInterface $validatorInterface)
    {
        // get the user connected thanks to JWT token 
        $user = $this->getUser();

        // get the json of the request
        $jsonContent = $request->getContent();

        try 
        {
        // deserialize the json into post entity
        $post = $serializer->deserialize($jsonContent, Post::class, 'json');
        } 
        catch (NotEncodableValueException $e) 
        {
            return $this->json(
                ["error" => "JSON INVALIDE"],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // set the user with the connected user 
        $post->setUser($user);

        // check if the post is correctly writen 
        $errors = $validatorInterface->validate($post);

        if(count($errors) > 0)
        {
            return $this->json(
                $errors, 
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }


        // save the modification of the entity
        $entityManager = $doctrine->getManager();
        $entityManager->persist($post);
        $entityManager->flush();

        return $this->json(
            $post,
            Response::HTTP_CREATED,
            [],
            ['groups' => 'get_post']
        );
    }
```  
2) Modification d'un écrit  
```php
      /**
   * road to get a post from a given id
   * @Route("/api/post/{id}", name="api_post_update_item", methods={"PUT"})
   * @isGranted("ROLE_USER", message="Vous devez être connecté")
   */
  public function updateItem(ManagerRegistry $doctrine, ?Post $post, Request $request, SerializerInterface $serializer, ValidatorInterface $validatorInterface)
  {

      $this->denyAccessUnlessGranted('POST_EDIT', $post);
      
      if(!$post) 
      {
          return $this->json(
              ['error' => "écrit non trouvé"],
              response::HTTP_NOT_FOUND
          );
      }

      else
      {
          // get the json
          $jsonContent = $request->getContent();

          try 
          {
          // deserialize the json into post entity
          $postModified = $serializer->deserialize($jsonContent, Post::class, 'json', ['object_to_populate' => $post]);

          } 
          catch (NotEncodableValueException $e) 
          {
              return $this->json(
                  ["error" => "JSON INVALIDE"],
                  Response::HTTP_UNPROCESSABLE_ENTITY
              );
          }
          $errors = $validatorInterface->validate($postModified);

          if(count($errors) > 0)
          {
              return $this->json(
                  $errors, 
                  Response::HTTP_UNPROCESSABLE_ENTITY
              );
          }

          // save the modification of the entity
          $entityManager = $doctrine->getManager();
          $entityManager->persist($postModified);
          $entityManager->flush();

          return $this->json(
              $postModified,
              Response::HTTP_CREATED,
              [],
              ['groups' => 'get_post']
          );
      }
  }
```

#### Le back-office :  

![backoffice](/assets/writertalent/backoffice.png)


#### Le lien github du projet : 

- Repository Back
- Repository Front