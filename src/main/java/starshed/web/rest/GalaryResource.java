package starshed.web.rest;

import com.codahale.metrics.annotation.Timed;
import starshed.domain.Galary;

import starshed.repository.GalaryRepository;
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
 * REST controller for managing Galary.
 */
@RestController
@RequestMapping("/api")
public class GalaryResource {

    private final Logger log = LoggerFactory.getLogger(GalaryResource.class);

    private static final String ENTITY_NAME = "galary";

    private final GalaryRepository galaryRepository;

    public GalaryResource(GalaryRepository galaryRepository) {
        this.galaryRepository = galaryRepository;
    }

    /**
     * POST  /galaries : Create a new galary.
     *
     * @param galary the galary to create
     * @return the ResponseEntity with status 201 (Created) and with body the new galary, or with status 400 (Bad Request) if the galary has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/galaries")
    @Timed
    public ResponseEntity<Galary> createGalary(@RequestBody Galary galary) throws URISyntaxException {
        log.debug("REST request to save Galary : {}", galary);
        if (galary.getId() != null) {
            throw new BadRequestAlertException("A new galary cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Galary result = galaryRepository.save(galary);
        return ResponseEntity.created(new URI("/api/galaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /galaries : Updates an existing galary.
     *
     * @param galary the galary to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated galary,
     * or with status 400 (Bad Request) if the galary is not valid,
     * or with status 500 (Internal Server Error) if the galary couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/galaries")
    @Timed
    public ResponseEntity<Galary> updateGalary(@RequestBody Galary galary) throws URISyntaxException {
        log.debug("REST request to update Galary : {}", galary);
        if (galary.getId() == null) {
            return createGalary(galary);
        }
        Galary result = galaryRepository.save(galary);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, galary.getId().toString()))
            .body(result);
    }

    /**
     * GET  /galaries : get all the galaries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of galaries in body
     */
    @GetMapping("/galaries")
    @Timed
    public List<Galary> getAllGalaries() {
        log.debug("REST request to get all Galaries");
        return galaryRepository.findAll();
        }

    /**
     * GET  /galaries/:id : get the "id" galary.
     *
     * @param id the id of the galary to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the galary, or with status 404 (Not Found)
     */
    @GetMapping("/galaries/{id}")
    @Timed
    public ResponseEntity<Galary> getGalary(@PathVariable Long id) {
        log.debug("REST request to get Galary : {}", id);
        Galary galary = galaryRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(galary));
    }

    /**
     * DELETE  /galaries/:id : delete the "id" galary.
     *
     * @param id the id of the galary to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/galaries/{id}")
    @Timed
    public ResponseEntity<Void> deleteGalary(@PathVariable Long id) {
        log.debug("REST request to delete Galary : {}", id);
        galaryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
