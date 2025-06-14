package com.gamemarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GameItemMarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GameItemMarketplaceApplication.class, args);
    }
}

