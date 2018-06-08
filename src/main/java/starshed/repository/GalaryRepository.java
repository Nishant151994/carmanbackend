package starshed.repository;

import starshed.domain.Galary;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Galary entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GalaryRepository extends JpaRepository<Galary, Long> {

}
