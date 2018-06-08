package starshed.web.rest;

import com.codahale.metrics.annotation.Timed;
import starshed.domain.Images;

import starshed.repository.ImagesRepository;
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
 * REST controller for managing Images.
 */
@RestController
@RequestMapping("/api")
public class ImagesResource {

    private final Logger log = LoggerFactory.getLogger(ImagesResource.class);

    private static final String ENTITY_NAME = "images";

    private final ImagesRepository imagesRepository;

    public ImagesResource(ImagesRepository imagesRepository) {
        this.imagesRepository = imagesRepository;
    }

    /**
     * POST  /images : Create a new images.
     *
     * @param images the images to create
     * @return the ResponseEntity with status 201 (Created) and with body the new images, or with status 400 (Bad Request) if the images has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/images")
    @Timed
    public ResponseEntity<Images> createImages(@RequestBody Images images) throws URISyntaxException {
        log.debug("REST request to save Images : {}", images);
        if (images.getId() != null) {
            throw new BadRequestAlertException("A new images cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Images result = imagesRepository.save(images);
        return ResponseEntity.created(new URI("/api/images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /images : Updates an existing images.
     *
     * @param images the images to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated images,
     * or with status 400 (Bad Request) if the images is not valid,
     * or with status 500 (Internal Server Error) if the images couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/images")
    @Timed
    public ResponseEntity<Images> updateImages(@RequestBody Images images) throws URISyntaxException {
        log.debug("REST request to update Images : {}", images);
        if (images.getId() == null) {
            return createImages(images);
        }
        Images result = imagesRepository.save(images);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, images.getId().toString()))
            .body(result);
    }

    /**
     * GET  /images : get all the images.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of images in body
     */
    @GetMapping("/images")
    @Timed
    public List<Images> getAllImages() {
        log.debug("REST request to get all Images");
        return imagesRepository.findAll();
        }

    /**
     * GET  /images/:id : get the "id" images.
     *
     * @param id the id of the images to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the images, or with status 404 (Not Found)
     */
    @GetMapping("/images/{id}")
    @Timed
    public ResponseEntity<Images> getImages(@PathVariable Long id) {
        log.debug("REST request to get Images : {}", id);
        Images images = imagesRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(images));
    }

    /**
     * DELETE  /images/:id : delete the "id" images.
     *
     * @param id the id of the images to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/images/{id}")
    @Timed
    public ResponseEntity<Void> deleteImages(@PathVariable Long id) {
        log.debug("REST request to delete Images : {}", id);
        imagesRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
