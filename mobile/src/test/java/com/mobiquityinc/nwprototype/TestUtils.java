package com.mobiquityinc.nwprototype;

import android.view.View;

import static org.fest.assertions.api.ANDROID.assertThat;


public class TestUtils {
    public static void assertVisibility(View view, boolean shouldBeVisible) {
        if(shouldBeVisible) {
            assertThat(view).isVisible();
        }
        else {
            assertThat(view).isNotVisible();
        }
    }

    public static View assertView(View view, Class clazz, boolean shouldBeVisible) {
        assertThat(view)
                .isNotNull()
                .isInstanceOf(clazz);
        assertVisibility(view, shouldBeVisible);

        return view;
    }
}
