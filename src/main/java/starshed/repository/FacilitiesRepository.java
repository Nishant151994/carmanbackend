package starshed.repository;

import starshed.domain.Facilities;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Facilities entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FacilitiesRepository extends JpaRepository<Facilities, Long> {

}
