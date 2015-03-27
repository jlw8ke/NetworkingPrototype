package com.mobiquityinc.prototype.wwprototype;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import static org.junit.Assert.*;

@RunWith(CustomTestRunner.class)
@Config(emulateSdk = 18)
public class WeatherApplicationTest {

    @Test
    public void testApplicationImplementsInjectable() {
        assertTrue(Robolectric.application instanceof Injectable);
    }

    @Test
    public void testApplicationContainsObjectGraph() {
        Injectable application = (Injectable)Robolectric.application;
        assertNotNull(application.getObjectGraph());
    }



}