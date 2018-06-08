package starshed.web.rest;

import starshed.CarmanBackendApp;

import starshed.domain.Activities;
import starshed.repository.ActivitiesRepository;
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
 * Test class for the ActivitiesResource REST controller.
 *
 * @see ActivitiesResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = CarmanBackendApp.class)
public class ActivitiesResourceIntTest {

    private static final String DEFAULT_ACTIVITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ACTIVITY_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_ACTIVITY_DETAILS = "BBBBBBBBBB";

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private ActivitiesRepository activitiesRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restActivitiesMockMvc;

    private Activities activities;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ActivitiesResource activitiesResource = new ActivitiesResource(activitiesRepository);
        this.restActivitiesMockMvc = MockMvcBuilders.standaloneSetup(activitiesResource)
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
    public static Activities createEntity(EntityManager em) {
        Activities activities = new Activities()
            .activityName(DEFAULT_ACTIVITY_NAME)
            .activityDetails(DEFAULT_ACTIVITY_DETAILS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return activities;
    }

    @Before
    public void initTest() {
        activities = createEntity(em);
    }

    @Test
    @Transactional
    public void createActivities() throws Exception {
        int databaseSizeBeforeCreate = activitiesRepository.findAll().size();

        // Create the Activities
        restActivitiesMockMvc.perform(post("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isCreated());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeCreate + 1);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getActivityName()).isEqualTo(DEFAULT_ACTIVITY_NAME);
        assertThat(testActivities.getActivityDetails()).isEqualTo(DEFAULT_ACTIVITY_DETAILS);
        assertThat(testActivities.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testActivities.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createActivitiesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = activitiesRepository.findAll().size();

        // Create the Activities with an existing ID
        activities.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivitiesMockMvc.perform(post("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isBadRequest());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        // Get all the activitiesList
        restActivitiesMockMvc.perform(get("/api/activities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activities.getId().intValue())))
            .andExpect(jsonPath("$.[*].activityName").value(hasItem(DEFAULT_ACTIVITY_NAME.toString())))
            .andExpect(jsonPath("$.[*].activityDetails").value(hasItem(DEFAULT_ACTIVITY_DETAILS.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    public void getActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);

        // Get the activities
        restActivitiesMockMvc.perform(get("/api/activities/{id}", activities.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(activities.getId().intValue()))
            .andExpect(jsonPath("$.activityName").value(DEFAULT_ACTIVITY_NAME.toString()))
            .andExpect(jsonPath("$.activityDetails").value(DEFAULT_ACTIVITY_DETAILS.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    public void getNonExistingActivities() throws Exception {
        // Get the activities
        restActivitiesMockMvc.perform(get("/api/activities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();

        // Update the activities
        Activities updatedActivities = activitiesRepository.findOne(activities.getId());
        // Disconnect from session so that the updates on updatedActivities are not directly saved in db
        em.detach(updatedActivities);
        updatedActivities
            .activityName(UPDATED_ACTIVITY_NAME)
            .activityDetails(UPDATED_ACTIVITY_DETAILS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restActivitiesMockMvc.perform(put("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedActivities)))
            .andExpect(status().isOk());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate);
        Activities testActivities = activitiesList.get(activitiesList.size() - 1);
        assertThat(testActivities.getActivityName()).isEqualTo(UPDATED_ACTIVITY_NAME);
        assertThat(testActivities.getActivityDetails()).isEqualTo(UPDATED_ACTIVITY_DETAILS);
        assertThat(testActivities.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testActivities.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingActivities() throws Exception {
        int databaseSizeBeforeUpdate = activitiesRepository.findAll().size();

        // Create the Activities

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restActivitiesMockMvc.perform(put("/api/activities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(activities)))
            .andExpect(status().isCreated());

        // Validate the Activities in the database
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteActivities() throws Exception {
        // Initialize the database
        activitiesRepository.saveAndFlush(activities);
        int databaseSizeBeforeDelete = activitiesRepository.findAll().size();

        // Get the activities
        restActivitiesMockMvc.perform(delete("/api/activities/{id}", activities.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Activities> activitiesList = activitiesRepository.findAll();
        assertThat(activitiesList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Activities.class);
        Activities activities1 = new Activities();
        activities1.setId(1L);
        Activities activities2 = new Activities();
        activities2.setId(activities1.getId());
        assertThat(activities1).isEqualTo(activities2);
        activities2.setId(2L);
        assertThat(activities1).isNotEqualTo(activities2);
        activities1.setId(null);
        assertThat(activities1).isNotEqualTo(activities2);
    }
}
