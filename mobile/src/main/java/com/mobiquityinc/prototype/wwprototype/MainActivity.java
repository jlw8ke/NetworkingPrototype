package com.mobiquityinc.prototype.wwprototype;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends BaseActivity
{
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.main;
    }
}
