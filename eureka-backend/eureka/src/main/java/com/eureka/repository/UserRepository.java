package com.eureka.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.eureka.model.User;


@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
	Optional <User> findByUsername(String username);
	
    @Query("SELECT COUNT(*) FROM User u WHERE u.username = :username")
    Long existsByUsername(@Param("username") String username);
}
