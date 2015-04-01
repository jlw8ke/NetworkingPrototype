package com.mobiquityinc.prototype.wwprototype;

import android.content.Context;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricGradleTestRunner;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

import javax.inject.Inject;

import dagger.ObjectGraph;

import static org.junit.Assert.*;

@RunWith(CustomTestRunner.class)
@Config(constants = BuildConfig.class)
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