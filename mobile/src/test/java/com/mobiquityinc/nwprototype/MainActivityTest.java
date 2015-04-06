package com.mobiquityinc.nwprototype;

import android.widget.Button;
import android.widget.TextView;

import com.mobiquityinc.nwprototype.ui.MainActivity;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.annotation.Config;

import butterknife.ButterKnife;

@RunWith(CustomTestRunner.class)
@Config(constants = BuildConfig.class)
public class MainActivityTest {

    MainActivity activity;

    @Before
    public void setup() {
        activity = Robolectric.setupActivity(MainActivity.class);
    }

    @Test
    public void hasUIElements() {
        TestUtils.assertView(
                ButterKnife.findById(activity, R.id.city_name),
                TextView.class,
                true
        );

        TestUtils.assertView(
                ButterKnife.findById(activity, R.id.btn_get_weather),
                Button.class,
                true
        );
    }





}