package starshed.web.rest;

import starshed.CarmanBackendApp;

import starshed.domain.Facilities;
import starshed.repository.FacilitiesRepository;
import starshed.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.util.List;

import static starshed.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the FacilitiesResource REST controller.
 *
 * @see FacilitiesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CarmanBackendApp.class)
public class FacilitiesResourceIntTest {

    private static final String DEFAULT_FACILITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FACILITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FACILITY_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_FACILITY_DETAILS = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private FacilitiesRepository facilitiesRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFacilitiesMockMvc;

    private Facilities facilities;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FacilitiesResource facilitiesResource = new FacilitiesResource(facilitiesRepository);
        this.restFacilitiesMockMvc = MockMvcBuilders.standaloneSetup(facilitiesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facilities createEntity(EntityManager em) {
        Facilities facilities = new Facilities()
            .facilityName(DEFAULT_FACILITY_NAME)
            .facilityDetails(DEFAULT_FACILITY_DETAILS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return facilities;
    }

    @Before
    public void initTest() {
        facilities = createEntity(em);
    }

    @Test
    @Transactional
    public void createFacilities() throws Exception {
        int databaseSizeBeforeCreate = facilitiesRepository.findAll().size();

        // Create the Facilities
        restFacilitiesMockMvc.perform(post("/api/facilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(facilities)))
            .andExpect(status().isCreated());

        // Validate the Facilities in the database
        List<Facilities> facilitiesList = facilitiesRepository.findAll();
        assertThat(facilitiesList).hasSize(databaseSizeBeforeCreate + 1);
        Facilities testFacilities = facilitiesList.get(facilitiesList.size() - 1);
        assertThat(testFacilities.getFacilityName()).isEqualTo(DEFAULT_FACILITY_NAME);
        assertThat(testFacilities.getFacilityDetails()).isEqualTo(DEFAULT_FACILITY_DETAILS);
        assertThat(testFacilities.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testFacilities.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createFacilitiesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = facilitiesRepository.findAll().size();

        // Create the Facilities with an existing ID
        facilities.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFacilitiesMockMvc.perform(post("/api/facilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(facilities)))
            .andExpect(status().isBadRequest());

        // Validate the Facilities in the database
        List<Facilities> facilitiesList = facilitiesRepository.findAll();
        assertThat(facilitiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFacilities() throws Exception {
        // Initialize the database
        facilitiesRepository.saveAndFlush(facilities);

        // Get all the facilitiesList
        restFacilitiesMockMvc.perform(get("/api/facilities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facilities.getId().intValue())))
            .andExpect(jsonPath("$.[*].facilityName").value(hasItem(DEFAULT_FACILITY_NAME.toString())))
            .andExpect(jsonPath("$.[*].facilityDetails").value(hasItem(DEFAULT_FACILITY_DETAILS.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getFacilities() throws Exception {
        // Initialize the database
        facilitiesRepository.saveAndFlush(facilities);

        // Get the facilities
        restFacilitiesMockMvc.perform(get("/api/facilities/{id}", facilities.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(facilities.getId().intValue()))
            .andExpect(jsonPath("$.facilityName").value(DEFAULT_FACILITY_NAME.toString()))
            .andExpect(jsonPath("$.facilityDetails").value(DEFAULT_FACILITY_DETAILS.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingFacilities() throws Exception {
        // Get the facilities
        restFacilitiesMockMvc.perform(get("/api/facilities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFacilities() throws Exception {
        // Initialize the database
        facilitiesRepository.saveAndFlush(facilities);
        int databaseSizeBeforeUpdate = facilitiesRepository.findAll().size();

        // Update the facilities
        Facilities updatedFacilities = facilitiesRepository.findOne(facilities.getId());
        // Disconnect from session so that the updates on updatedFacilities are not directly saved in db
        em.detach(updatedFacilities);
        updatedFacilities
            .facilityName(UPDATED_FACILITY_NAME)
            .facilityDetails(UPDATED_FACILITY_DETAILS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restFacilitiesMockMvc.perform(put("/api/facilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFacilities)))
            .andExpect(status().isOk());

        // Validate the Facilities in the database
        List<Facilities> facilitiesList = facilitiesRepository.findAll();
        assertThat(facilitiesList).hasSize(databaseSizeBeforeUpdate);
        Facilities testFacilities = facilitiesList.get(facilitiesList.size() - 1);
        assertThat(testFacilities.getFacilityName()).isEqualTo(UPDATED_FACILITY_NAME);
        assertThat(testFacilities.getFacilityDetails()).isEqualTo(UPDATED_FACILITY_DETAILS);
        assertThat(testFacilities.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testFacilities.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingFacilities() throws Exception {
        int databaseSizeBeforeUpdate = facilitiesRepository.findAll().size();

        // Create the Facilities

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFacilitiesMockMvc.perform(put("/api/facilities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(facilities)))
            .andExpect(status().isCreated());

        // Validate the Facilities in the database
        List<Facilities> facilitiesList = facilitiesRepository.findAll();
        assertThat(facilitiesList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFacilities() throws Exception {
        // Initialize the database
        facilitiesRepository.saveAndFlush(facilities);
        int databaseSizeBeforeDelete = facilitiesRepository.findAll().size();

        // Get the facilities
        restFacilitiesMockMvc.perform(delete("/api/facilities/{id}", facilities.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Facilities> facilitiesList = facilitiesRepository.findAll();
        assertThat(facilitiesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Facilities.class);
        Facilities facilities1 = new Facilities();
        facilities1.setId(1L);
        Facilities facilities2 = new Facilities();
        facilities2.setId(facilities1.getId());
        assertThat(facilities1).isEqualTo(facilities2);
        facilities2.setId(2L);
        assertThat(facilities1).isNotEqualTo(facilities2);
        facilities1.setId(null);
        assertThat(facilities1).isNotEqualTo(facilities2);
    }
}
