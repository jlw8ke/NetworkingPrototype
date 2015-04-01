package com.mobiquityinc.prototype.wwprototype;

import android.view.View;

import org.fest.assertions.api.android.view.ViewAssert;

import static org.fest.assertions.api.ANDROID.*;


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
