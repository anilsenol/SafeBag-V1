package com.example.safebag.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.ShopStatus;
import com.example.safebag.entities.User;

@Repository
public interface IShopRepository extends JpaRepository<Shop, Integer>{
	

	
	List<Shop> findAllShopsByShopOwner(User shopOwner);
	
	List<Shop> findByShopOwner_Id(Integer userId);
	
	List<Shop> findAllByStatus(ShopStatus status);

	List<Shop> findByCityIgnoreCaseAndStatus(String city, ShopStatus status);

}
