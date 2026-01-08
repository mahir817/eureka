package com.eureka.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.eureka.model.Buzzer;


@Repository
public interface BuzzerRepository extends JpaRepository<Buzzer, Long> {
	Optional<Buzzer> findBySecretCode(String secretCode);
}
