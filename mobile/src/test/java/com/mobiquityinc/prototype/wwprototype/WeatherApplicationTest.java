package com.mobiquityinc.prototype.wwprototype;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(CustomTestRunner.class)
@Config(constants = BuildConfig.class, emulateSdk = CustomTestRunner.MAX_SDK_SUPPORTED_BY_ROBOLECTRIC)
public class WeatherApplicationTest {

    @Test
    public void testApplicationImplementsInjectable() {
        assertTrue(RuntimeEnvironment.application instanceof Injectable);
    }

    @Test
    public void testApplicationContainsObjectGraph() {
        Injectable application = (Injectable)RuntimeEnvironment.application;
        assertNotNull(application.getObjectGraph());
    }

}