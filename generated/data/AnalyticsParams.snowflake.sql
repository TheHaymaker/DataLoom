CREATE OR REPLACE TABLE ANALYTICS_PARAMS (
  id INTEGER,
  name VARCHAR
);

INSERT INTO ANALYTICS_PARAMS (id, name) VALUES
  (0, 'url_params'),
  (1, 'utm_source'),
  (2, 'utm_medium'),
  (3, 'utm_campaign'),
  (4, 'utm_term'),
  (5, 'utm_content'),
  (6, 'gclid'),
  (7, 'fbclid'),
  (8, 'msclkid'),
  (9, 'dclid'),
  (10, 'ad_id'),
  (11, 'ad_name'),
  (12, 'ad_group_id'),
  (13, 'ad_group_name'),
  (14, 'gtm_id'),
  (15, 'gtm_event'),
  (16, 'gtm_trigger'),
  (17, 'gtm_variable'),
  (18, 'gtm_data_layer'),
  (19, 'gtm_container'),
  (20, 'gtm_account'),
  (21, 'gtm_workspace'),
  (22, 'gtm_version'),
  (23, 'gtm_environment');
