package com.eureka.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.eureka.model.Buzzer;

@Repository
public interface BuzzerRepository extends JpaRepository<Buzzer, Long> {
	Optional<Buzzer> findBySecretCode(String secretCode);

	@org.springframework.data.jpa.repository.Query("SELECT b FROM Buzzer b WHERE b.player1 = ?1 OR b.player2 = ?2")
	java.util.List<Buzzer> findByPlayer1OrPlayer2(com.eureka.model.User player1, com.eureka.model.User player2);
}
