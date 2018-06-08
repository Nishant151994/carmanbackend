package starshed.web.rest;

import starshed.CarmanBackendApp;

import starshed.domain.Galary;
import starshed.repository.GalaryRepository;
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

import javax.persistence.EntityManager;
import java.util.List;

import static starshed.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the GalaryResource REST controller.
 *
 * @see GalaryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CarmanBackendApp.class)
public class GalaryResourceIntTest {

    private static final String DEFAULT_GALARY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_GALARY_NAME = "BBBBBBBBBB";

    @Autowired
    private GalaryRepository galaryRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restGalaryMockMvc;

    private Galary galary;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GalaryResource galaryResource = new GalaryResource(galaryRepository);
        this.restGalaryMockMvc = MockMvcBuilders.standaloneSetup(galaryResource)
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
    public static Galary createEntity(EntityManager em) {
        Galary galary = new Galary()
            .galaryName(DEFAULT_GALARY_NAME);
        return galary;
    }

    @Before
    public void initTest() {
        galary = createEntity(em);
    }

    @Test
    @Transactional
    public void createGalary() throws Exception {
        int databaseSizeBeforeCreate = galaryRepository.findAll().size();

        // Create the Galary
        restGalaryMockMvc.perform(post("/api/galaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(galary)))
            .andExpect(status().isCreated());

        // Validate the Galary in the database
        List<Galary> galaryList = galaryRepository.findAll();
        assertThat(galaryList).hasSize(databaseSizeBeforeCreate + 1);
        Galary testGalary = galaryList.get(galaryList.size() - 1);
        assertThat(testGalary.getGalaryName()).isEqualTo(DEFAULT_GALARY_NAME);
    }

    @Test
    @Transactional
    public void createGalaryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = galaryRepository.findAll().size();

        // Create the Galary with an existing ID
        galary.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGalaryMockMvc.perform(post("/api/galaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(galary)))
            .andExpect(status().isBadRequest());

        // Validate the Galary in the database
        List<Galary> galaryList = galaryRepository.findAll();
        assertThat(galaryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllGalaries() throws Exception {
        // Initialize the database
        galaryRepository.saveAndFlush(galary);

        // Get all the galaryList
        restGalaryMockMvc.perform(get("/api/galaries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(galary.getId().intValue())))
            .andExpect(jsonPath("$.[*].galaryName").value(hasItem(DEFAULT_GALARY_NAME.toString())));
    }

    @Test
    @Transactional
    public void getGalary() throws Exception {
        // Initialize the database
        galaryRepository.saveAndFlush(galary);

        // Get the galary
        restGalaryMockMvc.perform(get("/api/galaries/{id}", galary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(galary.getId().intValue()))
            .andExpect(jsonPath("$.galaryName").value(DEFAULT_GALARY_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGalary() throws Exception {
        // Get the galary
        restGalaryMockMvc.perform(get("/api/galaries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateGalary() throws Exception {
        // Initialize the database
        galaryRepository.saveAndFlush(galary);
        int databaseSizeBeforeUpdate = galaryRepository.findAll().size();

        // Update the galary
        Galary updatedGalary = galaryRepository.findOne(galary.getId());
        // Disconnect from session so that the updates on updatedGalary are not directly saved in db
        em.detach(updatedGalary);
        updatedGalary
            .galaryName(UPDATED_GALARY_NAME);

        restGalaryMockMvc.perform(put("/api/galaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedGalary)))
            .andExpect(status().isOk());

        // Validate the Galary in the database
        List<Galary> galaryList = galaryRepository.findAll();
        assertThat(galaryList).hasSize(databaseSizeBeforeUpdate);
        Galary testGalary = galaryList.get(galaryList.size() - 1);
        assertThat(testGalary.getGalaryName()).isEqualTo(UPDATED_GALARY_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingGalary() throws Exception {
        int databaseSizeBeforeUpdate = galaryRepository.findAll().size();

        // Create the Galary

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restGalaryMockMvc.perform(put("/api/galaries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(galary)))
            .andExpect(status().isCreated());

        // Validate the Galary in the database
        List<Galary> galaryList = galaryRepository.findAll();
        assertThat(galaryList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteGalary() throws Exception {
        // Initialize the database
        galaryRepository.saveAndFlush(galary);
        int databaseSizeBeforeDelete = galaryRepository.findAll().size();

        // Get the galary
        restGalaryMockMvc.perform(delete("/api/galaries/{id}", galary.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Galary> galaryList = galaryRepository.findAll();
        assertThat(galaryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Galary.class);
        Galary galary1 = new Galary();
        galary1.setId(1L);
        Galary galary2 = new Galary();
        galary2.setId(galary1.getId());
        assertThat(galary1).isEqualTo(galary2);
        galary2.setId(2L);
        assertThat(galary1).isNotEqualTo(galary2);
        galary1.setId(null);
        assertThat(galary1).isNotEqualTo(galary2);
    }
}
