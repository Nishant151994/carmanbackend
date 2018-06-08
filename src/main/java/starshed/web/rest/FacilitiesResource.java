package starshed.web.rest;

import com.codahale.metrics.annotation.Timed;
import starshed.domain.Facilities;

import starshed.repository.FacilitiesRepository;
import starshed.web.rest.errors.BadRequestAlertException;
import starshed.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Facilities.
 */
@RestController
@RequestMapping("/api")
public class FacilitiesResource {

    private final Logger log = LoggerFactory.getLogger(FacilitiesResource.class);

    private static final String ENTITY_NAME = "facilities";

    private final FacilitiesRepository facilitiesRepository;

    public FacilitiesResource(FacilitiesRepository facilitiesRepository) {
        this.facilitiesRepository = facilitiesRepository;
    }

    /**
     * POST  /facilities : Create a new facilities.
     *
     * @param facilities the facilities to create
     * @return the ResponseEntity with status 201 (Created) and with body the new facilities, or with status 400 (Bad Request) if the facilities has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/facilities")
    @Timed
    public ResponseEntity<Facilities> createFacilities(@RequestBody Facilities facilities) throws URISyntaxException {
        log.debug("REST request to save Facilities : {}", facilities);
        if (facilities.getId() != null) {
            throw new BadRequestAlertException("A new facilities cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Facilities result = facilitiesRepository.save(facilities);
        return ResponseEntity.created(new URI("/api/facilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /facilities : Updates an existing facilities.
     *
     * @param facilities the facilities to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated facilities,
     * or with status 400 (Bad Request) if the facilities is not valid,
     * or with status 500 (Internal Server Error) if the facilities couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/facilities")
    @Timed
    public ResponseEntity<Facilities> updateFacilities(@RequestBody Facilities facilities) throws URISyntaxException {
        log.debug("REST request to update Facilities : {}", facilities);
        if (facilities.getId() == null) {
            return createFacilities(facilities);
        }
        Facilities result = facilitiesRepository.save(facilities);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, facilities.getId().toString()))
            .body(result);
    }

    /**
     * GET  /facilities : get all the facilities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of facilities in body
     */
    @GetMapping("/facilities")
    @Timed
    public List<Facilities> getAllFacilities() {
        log.debug("REST request to get all Facilities");
        return facilitiesRepository.findAll();
        }

    /**
     * GET  /facilities/:id : get the "id" facilities.
     *
     * @param id the id of the facilities to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the facilities, or with status 404 (Not Found)
     */
    @GetMapping("/facilities/{id}")
    @Timed
    public ResponseEntity<Facilities> getFacilities(@PathVariable Long id) {
        log.debug("REST request to get Facilities : {}", id);
        Facilities facilities = facilitiesRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(facilities));
    }

    /**
     * DELETE  /facilities/:id : delete the "id" facilities.
     *
     * @param id the id of the facilities to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/facilities/{id}")
    @Timed
    public ResponseEntity<Void> deleteFacilities(@PathVariable Long id) {
        log.debug("REST request to delete Facilities : {}", id);
        facilitiesRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
